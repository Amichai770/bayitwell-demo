# Bayitwell, the public demo

The landing page and the live demo of Bayitwell, a private household routine
service for staffed, Shabbos-observant homes. Everything here runs on a
fictional household, the Sterns and their invented staff.

Live at https://bayitwell.vercel.app

## What is here

| Path | What it is |
|---|---|
| `index.html`, `assets/` | The landing page and its brand card |
| `api/app.ts` | One Vercel function that serves the live Command Center (`/live`), the phone view (`/today`), the API (`/api/*`), and the WhatsApp webhook (`/webhook`) |
| `lib/demo-day.ts` | Plays the fictional household's day on a clock so the live pages move without a real household behind them |
| `vercel.json` | Rewrites into the function and the security headers |
| `archive/` | Earlier static snapshots of the dashboards, kept for history, not deployed |

## What is not here

`api/app.ts` imports `../engine/`, which is not in this repository. The engine
is the product and lives in a private repository; it is copied into `engine/`
at deploy time and is gitignored here. Cloning this repo gives you the landing
page and the function's shell, not a running engine. That split is deliberate.

Deploys are made with the Vercel CLI from a working copy that has the engine
vendored in. The Vercel project is not connected to this repository.
