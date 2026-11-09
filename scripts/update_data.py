"""Append new draws from Singapore Pools' public results pages to data/4d_prizes.csv, then rebuild draws.json.

The latest-results file only holds the last 6 draws. Any older missing draws are
fetched one at a time from the draw list and each draw's own results page, so a
missed run (or a long gap) fills itself in.
"""
import base64, csv, re, subprocess, sys, time, urllib.request

BASE = "https://www.singaporepools.com.sg"
TOP_URL = BASE + "/DataFileArchive/Lottery/Output/fourd_result_top_draws_en.html"
LIST_URL = BASE + "/DataFileArchive/Lottery/Output/fourd_result_draw_list_en.html"
DRAW_URL = BASE + "/en/product/pages/4d_results.aspx?sppl="
MON = {m: i + 1 for i, m in enumerate("Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}
# One draw as the results pages print it: date, draw number, then the 23 numbers
# in prize order (1st, 2nd, 3rd, 10 Starter, 10 Consolation), matching the CSV.
DRAW_RE = re.compile(
    r"(\d{1,2}) ([A-Z][a-z]{2}) (\d{4})\W*Draw No\.?\s*(\d+)\s*"
    r"1st Prize (\d{4}) 2nd Prize (\d{4}) 3rd Prize (\d{4}) "
    r"Starter Prizes ((?:\d{4} ){9}\d{4}) Consolation Prizes ((?:\d{4} ){9}\d{4})"
)


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")


def to_text(html):
    html = re.sub(r"<(script|style)[\s\S]*?</\1>", " ", html)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>|&nbsp;", " ", html))


def parse_draws(text):
    """Return {draw_number: (date, [23 numbers])} for every complete draw in the text."""
    found = {}
    for m in DRAW_RE.finditer(text):
        day, mon, year, dn = m.group(1), m.group(2), m.group(3), int(m.group(4))
        nums = [m.group(5), m.group(6), m.group(7), *m.group(8).split(), *m.group(9).split()]
        found.setdefault(dn, (f"{year}/{MON[mon]:02d}/{int(day):02d}", nums))
    return found


last = max(int(r["draw_number"]) for r in csv.DictReader(open("data/4d_prizes.csv", newline="")))
new = {dn: v for dn, v in parse_draws(to_text(fetch(TOP_URL))).items() if dn > last}

# Backfill anything between the CSV and the latest-results file from each draw's own page.
listed = {int(v): (q, c) for v, q, c in re.findall(
    r"value='(\d+)' queryString='sppl=([^']+)' isCancelled='([^']*)'", fetch(LIST_URL))}
for dn in sorted(d for d in listed if d > last and d not in new):
    sppl, cancelled = listed[dn]
    if cancelled:
        print(f"Draw {dn} was cancelled; skipping")
        continue
    if base64.b64decode(sppl).decode() != f"DrawNumber={dn}":
        print(f"Draw {dn}: unexpected query string; skipping")
        continue
    got = parse_draws(to_text(fetch(DRAW_URL + sppl))).get(dn)
    if got:
        new[dn] = got
    else:
        print(f"Draw {dn}: could not read its results; it stays missing")
    time.sleep(1)  # be polite to the source

top = max(new or [last])
missing = [d for d in range(last + 1, top + 1) if d not in new and not listed.get(d, ("", ""))[1]]
if missing:
    print(f"Note: draws {missing} could not be fetched and stay missing")
if new:
    with open("data/4d_prizes.csv", "a", newline="") as f:
        w = csv.writer(f, lineterminator="\r\n")
        for dn in sorted(new):
            dt, nums = new[dn]
            for n in nums:
                w.writerow([dn, n, dt])
    subprocess.run([sys.executable, "scripts/build_data.py"], check=True)
print(f"Added {len(new)} draws")
