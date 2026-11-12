# Key collections map (Rezt+Relax, internal)

Map of HDB BTOs, condos and ECs with keys due soon, for targeting marketing.

- Built with Vite + Mapbox GL. Data lives in `src/data.js`.
- Needs the environment variable `VITE_MAPBOX_TOKEN` (a public Mapbox token) in Vercel.
- Run locally: `npm install`, then `npm run dev`.

## Adding a project

1. Add it to `src/data.js`.
2. Add its building picture and floor plans to `src/media.js` (same `id`). BTOs only need the BTOHQ launch folder and slug; the HDB brochure opens in-page. Without an entry the card just shows no pictures.
