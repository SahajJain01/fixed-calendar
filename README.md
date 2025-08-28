# Fixed Calendar

Simple static page visualizing a 13×28 International Fixed Calendar (IFC) with New Year Day(s). Built with AngularJS 1.x and Bootstrap styles.

## Features

- Scrolls to the current day-of-year on load.
- Year navigation arrows jump to the same Gregorian month/day in the selected year (handles month length gracefully).
- Highlights today in the current year.

## Run Locally

Option 1 — Bun (recommended):

```bash
bun run start
# then open http://localhost:8080
```

Option 2 — Node built-in static server (no deps):

```bash
npm run start:node
# then open http://localhost:8080
```

Option 3 — Python (if installed):

```bash
python -m http.server 8080
# then open http://localhost:8080
```

Option 4 — http-server via npx (requires Node):

```bash
npx http-server -p 8080 -c-1
```

## Notes

- This is a static, client-only demo. No routing, animation, or sanitization features are used; Angular core is sufficient.
- Day IDs 1–364 map to IFC month grid; 365 and 366 map to New Year Day(s).
- Leap year logic uses the standard Gregorian rule.

## Project Structure

- `index.html` — markup and layout
- `app.js` — AngularJS controller and logic
- `assets/` — styles and libraries
- `server.js` — minimal static web server
