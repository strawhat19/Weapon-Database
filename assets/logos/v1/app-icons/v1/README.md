# Armory Crest App Icons — v1

Both icons contain the exact approved v23 crest geometry and colors. The crest is centered at the same scale in both variants; there is no wordmark or extra symbol.

| Variant | Artwork | Background |
| --- | --- | --- |
| Transparent | `01-crest-transparent.svg` | Fully transparent square canvas around the crest |
| Silver Steel | `02-crest-steel-silver.svg` | Brushed silver gradient tile with rounded corners and transparent outside corners |

Each SVG has PNG exports at 16, 32, 180, 192, 512, and 1024 pixels. The native SVGs are editable, and the PNGs are rendered directly from those SVGs. The steel material uses silver gradients, fine vertical brushing, and a subtle edge bevel. Its palette is `#CBD3D7`, `#F1F4F5`, `#B9C3C8`, `#E1E6E8`, and `#AAB7BE`; the crest's existing colors are unchanged.

Production copies are in `public/media/brand/app-icons/v1/`. Previous identity assets and the earlier charcoal app icon files are preserved.

## Try Either Icon

Set `appIconStyle` in `src/shared/config.ts` to `transparent` or `steel`, then reload the app. The selection controls the browser favicon, Apple touch icon, and linked PWA manifest. Steel is the current selection.

The Expo favicon fallback in `app.json` also points to the steel 192px PNG. To try the transparent fallback, use `./public/media/brand/app-icons/v1/01-crest-transparent-192.png`.
