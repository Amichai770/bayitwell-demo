# Mishmeret, the app

A daily watch of the priesthood, for the Kohanim of today. Mobile-first web app, installable on the phone, no framework and no build step. Formerly Kehuna Academy.

## What is in here

| File | What it is |
|---|---|
| `index.html`, `styles.css`, `app.js` | The app: Tamid, Duchan, Mishmar, Beit Midrash, Ask, You |
| `content.js` | All teaching content: the Tamid weeks, the fifteen kavanot, the 24 watches, the paths and lessons, the prepared answers, the companion's rules. Every teaching is a draft for Rabbi Amichai's review. |
| `api/ask.ts` | The study companion endpoint. A Vercel function that calls the Claude API with the scoped rules. The key stays on the server. |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installable app: home-screen icon, standalone display, offline shell |
| `scripts/build-artifact.js` | Builds the claude.ai artifact version of the page |

## How Ask works

The app tries three backends in order: the claude.ai artifact runtime (when opened as an artifact), then `api/ask` on the same host (when deployed on Vercel with `ANTHROPIC_API_KEY`), then prepared answers. The companion answers only questions about the Kehuna, cites its sources inline, and never rules on a personal halachic case.

## Deploy on Vercel

1. In Vercel, "Add New Project", import `Amichai770/bayitwell-demo`, and set the **Root Directory** to `kehuna-academy/app`. Framework preset: Other. No build command; output directory `.`.
2. Add the environment variable `ANTHROPIC_API_KEY` (from console.anthropic.com).
3. Deploy. The function at `/api/ask` answers `GET` with `{ok:true}` when the key is present.
4. Custom domain: add `mishmeret.kehunacademy.com` in the Vercel project, then add the CNAME it gives you in the DNS of kehunacademy.com.

## Adding a week of Tamid

Append an object to `MISHMERET.weeks` in `content.js` with `start: "YYYY-MM-DD"` (a Sunday) and seven `days`, each with `morning` and `afternoon`. The app picks the week whose `start` matches the current week; with no match it rotates through the weeks it has.

## Next version

Sign-in, real mishmar circles with a shared weekly thread, audio for the Rambam chapters inside the app, and the companion grounded in Rabbi Amichai's own transcripts.
