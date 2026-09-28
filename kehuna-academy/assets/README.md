# Mishmeret visual assets

Rendered from the HTML templates in `src/` with Chromium (Playwright). Palette and type match the app prototype: Jerusalem stone (#ECE4D4), dusk indigo (#171B3A), gold (#A9802A), ember (#B45A36); Cormorant Garamond for Latin, Frank Ruhl Libre for Hebrew.

| File | Size | Used for |
|---|---|---|
| hero-evening.jpg | 2400x1350 | Home page hero background (bein ha'arbayim) |
| hero-morning.jpg | 2400x1350 | "The verse" section image and the band below it |
| card-beit-midrash.jpg | 1200x800 | Card: the Rambam's Laws of the Temple |
| card-mishmar.jpg | 1200x800 | Card: the 24 watches |
| card-duchan.jpg | 1200x800 | Card: Birkat Kohanim (the three verses) |
| og-mishmeret.jpg | 1200x630 | Social sharing card |

The live site references these by their raw GitHub URL on this branch. For permanence, upload them to the Kajabi media library and point the theme at those copies.

To re-render: `cd src && NODE_PATH=/opt/node22/lib/node_modules node render.js` (needs Chromium and network access to Google Fonts).
