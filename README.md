<div align="center">

# Fixed Calendar (IFC)

![Bun](https://img.shields.io/badge/Bun-1.x-000000?logo=bun&logoColor=white)
![AngularJS](https://img.shields.io/badge/AngularJS-1.6-c3002f?logo=angular&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-4.5-7952B3?logo=bootstrap&logoColor=white)
![Nix](https://img.shields.io/badge/Nix-Flake-7e7eff?logo=nixos&logoColor=white)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
[![Deploy Status](https://github.com/sahajjain01/fixed-calendar/actions/workflows/docker-publish.yml/badge.svg?branch=main)](https://github.com/sahajjain01/fixed-calendar/actions/workflows/docker-publish.yml)
[![Last Commit](https://img.shields.io/github/last-commit/sahajjain01/fixed-calendar)](https://github.com/sahajjain01/fixed-calendar/commits/main)

[![Live](https://img.shields.io/badge/Live-calendar.sahajjain.com-2ea44f)](https://calendar.sahajjain.com)

Interactive visual of the 13A-28 International Fixed Calendar with New Year Day(s). Production-ready build and deploy with Docker, Nix Flakes, and GitHub Actions.

</div>

---

## Features

- Scrolls to the current day-of-year on load
- Year navigation with graceful month/day handling
- Highlights today in the current year
- Zero-dependency static server (Node http) with strict path safety
- Minification-safe AngularJS DI for production builds

## Tech Stack

- Bun 1.x (build/run scripts)
- AngularJS 1.6 + Bootstrap 4
- Docker + GHCR (image builds)
- Nix Flakes + deploy-rs (deploy)
- Systemd user or system service (server-side runtime, via your NixOS config)

## Local Scripts

- Dev: `bun run dev` — serves from the repo root at `http://localhost:3000`.
- Build: `bun run build` — outputs a production bundle to `dist/`.
- Prod: `bun run prod` — builds then serves static files from `dist/`.

The server also supports `--root <dir>` or `STATIC_ROOT=<dir>` to choose a directory to serve.

## CI/CD (Docker + deploy-rs)

- GitHub Actions builds a multi-arch Docker image (amd64 + arm64) and pushes to GHCR.
- After a successful push, a dependent deploy job runs deploy-rs over SSH to update the server (NixOS switch).
- Deploy evaluates the flake for the ARM target:
  - `nix run --system aarch64-linux .#deploy -- "$NIX_SSH_USER@$NIX_SSH_HOST"`

Workflow file: `.github/workflows/docker-publish.yml`

Docker image:
- Registry: `ghcr.io/<owner>/<repo>`
- Tags: `latest` (on main), `sha-<commit>`, and release tags `v*`.

Required repository secrets:
- `NIX_SSH_HOST`: server hostname/IP
- `NIX_SSH_USER`: SSH user used for deployment
- `NIX_SSH_KEY`: private key for that user (PEM content)

Expectations for deploy-rs:
- This repo’s Nix flake should provide an app or package `.#deploy` that uses deploy-rs to switch the target host.
- If your deploy flake lives elsewhere, adjust the workflow command to reference it (e.g., `nix run github:owner/infra#deploy -- "$NIX_SSH_USER@$NIX_SSH_HOST"`).

Server prerequisites:
- NixOS host reachable via SSH with the above user and key.
- deploy-rs available in the flake evaluation and permissions to perform the system switch.

## Reverse Proxy

- Termination/proxy (e.g., Caddy or Nginx) should be configured in your NixOS configuration managed by deploy-rs.
- Point DNS at your server and expose the internal service defined by your flake.

## Troubleshooting

- AngularJS injector errors (e.g., Unknown provider) in production indicate missing minification-safe DI. This project uses array annotations; you can also enable `ng-strict-di` on the root tag.
- Build/runtime differences on ARM are handled by building a multi-arch image and evaluating the flake for `aarch64-linux` during deploy.

## Architecture at a Glance

- `index.html` — markup and layout
- `app.js` — AngularJS controller and logic (DI-safe)
- `assets/` — styles, icons, AngularJS lib
- `server.js` — minimal static web server with content-type mapping
- `scripts/build.mjs` — Bun build + asset copy to `dist/`
- `scripts/prod.mjs` — Build then run server against `dist/`
- `Dockerfile` — multi-arch image build
- `.github/workflows/docker-publish.yml` — CI/CD build + deploy (deploy-rs)

