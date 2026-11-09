# 4D Explorer

A statistics website for Singapore 4D results (1986 onward): win counts by prize type, time since last win, digit frequency, gap analysis and a bet calculator.

**It describes history only. Draws are random and nothing here predicts future results.**

## Run locally
```bash
npm install
npm run dev
```
Built with React, TypeScript, React Router and Vite.

## Update the data
1. Replace `data/4d_prizes.csv` (columns `draw_number,number,date`; rows per draw in prize order: 1st, 2nd, 3rd, 10 Starter, 10 Consolation).
2. Run `npm run data` to regenerate `public/data/draws.json`.

**Automatic updates:** `.github/workflows/update-data.yml` runs after each draw (Wed, Sat, Sun) and runs `scripts/update_data.py`, which appends new draws from Singapore Pools' public results pages, commits, and redeploys. It reads the latest-results file (the last 6 draws) and fetches any older missing draws one at a time from each draw's own results page, so a missed run or a long gap fills itself in. Cancelled draws are skipped. Run `npm run update` to try it locally. It was used on 9 Nov 2026 to backfill draws 5509–5559.

You can also load a newer CSV in the browser with the "Load newer CSV" button (not saved).

## Deploy
- **Vercel:** import the repo; the framework preset is Vite.
- **GitHub Pages:** enable Pages with source "GitHub Actions"; `.github/workflows/deploy.yml` builds on every push to `main`.

## Notes
- Prize types are inferred from CSV row order, as the CSV has no prize column.
- Prize amounts follow the Singapore Pools 4D Game Rules. Check the official site for current terms.
- Independent project, not affiliated with Singapore Pools.
