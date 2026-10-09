# Crest-Shaped Silver Steel App Icon — v2

`01-crest-steel-shield.svg` keeps the approved v23 crest geometry and colors unchanged. Its backing uses the same shield contour enlarged by 10% around its center, with a visible brushed silver rim and subtle beveled edges. The canvas outside the crest-shaped badge is fully transparent.

The backing carries forward v1's native silver gradients and fine vertical brushing. Its palette is `#CBD3D7`, `#F1F4F5`, `#B9C3C8`, `#E1E6E8`, and `#AAB7BE`. It contains no square or rounded-square background.

The SVG is editable. PNG exports are rendered directly from it at 16, 32, 180, 192, 512, and 1024 pixels. Production copies are in `public/media/brand/app-icons/v2/`; v1's transparent and rounded silver options are preserved.

`appIconStyle` in `src/shared/config.ts` is set to `steel-crest`. This selects the corresponding favicon, Apple touch icon, and PWA manifest.

The Expo favicon fallback in `app.json` also uses `./public/media/brand/app-icons/v2/01-crest-steel-shield-192.png`.
