<div align="center">

# Fixed Calendar (IFC)

![Bun](https://img.shields.io/badge/Bun-1.x-000000?logo=bun&logoColor=white)
![AngularJS](https://img.shields.io/badge/AngularJS-1.6-c3002f?logo=angular&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-4.5-7952B3?logo=bootstrap&logoColor=white)
![Nix](https://img.shields.io/badge/Nix-Flake-7e7eff?logo=nixos&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
[![Deploy Status](https://github.com/OWNER/REPO/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/OWNER/REPO/actions/workflows/deploy.yml)
[![Last Commit](https://img.shields.io/github/last-commit/OWNER/REPO)](https://github.com/OWNER/REPO/commits/main)

[![Live](https://img.shields.io/badge/Live-calendar.sahajjain.com-2ea44f)](https://calendar.sahajjain.com)

Interactive visual of the 13×28 International Fixed Calendar with New Year Day(s). Production‑ready build + deploy with Nix Flakes and GitHub Actions.

<sub>Note: replace OWNER/REPO above with your GitHub org/user and repo to activate live badges.</sub>

</div>

---

## Features

- Scrolls to the current day-of-year on load
- Year navigation with graceful month/day handling
- Highlights today in the current year
- Zero‑dependency static server (Node http) with strict path safety
- Minification‑safe AngularJS DI for production builds

## Tech Stack

- Bun 1.x (build/run scripts)
- AngularJS 1.6 + Bootstrap 4
- Nix Flakes (packaging) + GitHub Actions (deploy)
- Systemd user service (server‑side runtime)

## Local Scripts

- Dev: `bun run dev` — serves from the repo root at `http://localhost:3000`.
- Build: `bun run build` — outputs a production bundle to `dist/`.
- Prod: `bun run prod` — builds then serves static files from `dist/`.

The server also supports `--root <dir>` or `STATIC_ROOT=<dir>` to choose a directory to serve.

## Production Pipeline (Nix + GitHub Actions)

- Nix flake packages the app and emits a start wrapper: `fixed-calendar-start`.
- GitHub Actions remote‑builds on the target ARM (aarch64) NixOS server via `ssh-ng` to match architecture.
- The workflow writes/updates a `systemd --user` unit and restarts the service.

Workflow file: `.github/workflows/deploy.yml`

Required repository secrets:
- `NIX_SSH_HOST`: server hostname/IP
- `NIX_SSH_USER`: deploy user (e.g., `github`)
- `NIX_SSH_KEY`: deploy user’s private key (ED25519)
- `APP_NAME`: systemd user service name (e.g., `fixedcalendar`)
- `APP_PORT`: port to serve on (e.g., `3000`)
 - `APP_DOMAIN`: domain routed to this app (e.g., `calendar.example.com`)

Server prerequisites (one‑time):
- Enable user lingering so the service runs without a login: `sudo loginctl enable-linger <user>`
- Open firewall for `${APP_PORT}` if exposing externally.

Deploy steps:
- Push to `main` or re‑run the workflow in Actions.
- The job remote‑builds the flake on the server and restarts `${APP_NAME}`.

Verify on server (as deploy user):
- `systemctl --user status ${APP_NAME} --no-pager`
- `journalctl --user -u ${APP_NAME} -e --no-pager`
- `curl -fsS http://127.0.0.1:${APP_PORT} | head -n1`

## Reverse Proxy (Caddy)

- NixOS enables Caddy and imports per-app vhosts from `/srv/caddy/conf.d/*.caddy`.
- The deploy workflow writes `/srv/caddy/conf.d/${APP_NAME}.caddy` with:
  - Host: `${APP_DOMAIN}` (from GitHub Secret)
  - Upstream: `reverse_proxy 127.0.0.1:${APP_PORT}` (private per-app port)
  - Compression and basic security headers
- Ensure DNS for `${APP_DOMAIN}` points to your server. Caddy will request/renew TLS automatically using the email configured in NixOS.

## Troubleshooting

- AngularJS injector errors (e.g., Unknown provider) in production indicate missing minification‑safe DI. This project uses array annotations; you can also enable `ng-strict-di` on the root tag.
- Exec format errors on ARM were addressed by building on the target host and using target‑arch Bun at runtime via `flake.nix`.

## Architecture at a Glance

- `index.html` — markup and layout
- `app.js` — AngularJS controller and logic (DI‑safe)
- `assets/` — styles, icons, AngularJS lib
- `server.js` — minimal static web server with content‑type mapping
- `scripts/build.mjs` — Bun build + asset copy to `dist/`
- `scripts/prod.mjs` — Build then run server against `dist/`
- `flake.nix` — Nix package and start wrapper
- `.github/workflows/deploy.yml` — CI/CD deploy to NixOS
