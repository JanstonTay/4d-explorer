"""Convert data/4d_prizes.csv (draw_number,number,date) into public/data/draws.json."""
import csv, json
from collections import OrderedDict
d = OrderedDict()
for r in csv.DictReader(open("data/4d_prizes.csv", newline="")):
    k = int(r["draw_number"])
    d.setdefault(k, [k, r["date"].replace("/", "-"), []])[2].append(int(r["number"]))
json.dump(list(d.values()), open("public/data/draws.json", "w"), separators=(",", ":"))
print(len(d), "draws written")
