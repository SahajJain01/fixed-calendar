<div align="center">

# Fixed Calendar (IFC)

![Bun](https://img.shields.io/badge/Bun-1.x-000000?logo=bun&logoColor=white)
![AngularJS](https://img.shields.io/badge/AngularJS-1.6-c3002f?logo=angular&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-4.5-7952B3?logo=bootstrap&logoColor=white)
![Status](https://img.shields.io/badge/App-Static%20Site-2ea44f)
![Visibility](https://img.shields.io/badge/Repo-Private-lightgrey)

Interactive visual of the 13×28 International Fixed Calendar with New Year Day(s).

</div>

---

## Features

- Scrolls to the current day-of-year on load
- Year navigation with graceful month/day handling
- Highlights today in the current year

## Requirements

- Bun 1.x installed: https://bun.sh

## Scripts

- Dev: `bun run dev` — serves from the repo root at `http://localhost:3000`.
- Build: `bun run build` — outputs a production bundle to `dist/`.
- Prod: `bun run prod` — builds then serves static files from `dist/`.

The server also supports `--root <dir>` or `STATIC_ROOT=<dir>` to choose a directory to serve.

## Notes

- Static, client-only demo; AngularJS core only (no routing/animation).
- Day IDs 1–364 map to the 13 months; 365/366 are New Year Day(s).
- Leap year logic uses the standard Gregorian rule.

## Troubleshooting

- AngularJS injector errors (e.g., Unknown provider) in production typically indicate missing minification-safe DI annotations. This project uses array annotations for controllers. You can also add `ng-strict-di` to the root tag in `index.html` for early detection: `<html lang="en" ng-app="ifc" ng-strict-di>`.

## Project Structure

- `index.html` — markup and layout
- `app.js` — AngularJS controller and logic
- `assets/` — styles and libraries
- `server.js` — minimal static web server
- `scripts/build.mjs` — build to `dist/`
- `scripts/prod.mjs` — build then serve from `dist/`

