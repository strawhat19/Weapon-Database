# Weapon Database — Armory Crest v15

This round creates genuine vector artwork from the selected original v13 logo and brand card. The SVGs contain editable paths with outlined lettering, no embedded bitmaps and no font dependencies. The standalone logo and card are traced separately to preserve their original layouts and proportions.

The traces retain the shield, weapons, circular pommel, stencil lettering and small details. Crisp letter polygons, straight-edge cleanup and smooth silver contours improve scaling. Raster texture and shading are simplified, and anti-aliasing differs, so these are faithful vector traces rather than pixel-identical copies of the original PNGs. Traced colors are sampled from the source artwork; they are not forced to the nominal palette tokens.

| File | Purpose |
| --- | --- |
| `01-armory-crest-mark.svg` | Crest with a transparent surrounding canvas. |
| `01-armory-crest-lockup.svg` | Original vertical arrangement: crest above the two-line wordmark. |
| `02-armory-crest-horizontal.svg` | Crest beside the original card's one-row wordmark. |
| `02-armory-crest-shield-left-stacked.svg` | Shield on the left, with “Weapon” above “Database” on the right. |
| `03-armory-crest-v15.svg` | Full original standalone layout, including black canvas and Armory Crest caption. |
| `04-armory-crest-brand-card.svg` | Original card composition, palette and font specimens; its v13 header is preserved. |
| `05-weapon-database-wordmark.svg` | Original two-line custom stencil lettering as vector outlines. |
| `03-armory-crest-v15.png` | Unchanged, byte-for-byte copy of the original v13 standalone PNG. |
| `04-armory-crest-brand-card.png` | Unchanged, byte-for-byte copy of the original v13 card PNG. |
| `brand-tokens.json` | Nominal original palette and vector/source format information. |

Reusable SVGs have PNG renders with the same basename. The full standalone and card vector renders are named `03-armory-crest-v15-vector.png` and `04-armory-crest-brand-card-vector.png`, keeping them distinct from the unchanged originals. Vector PNG renders use twice the SVG's native dimensions.

The original sources are `../v13/03-armory-crest-v13.png` and `../v13/04-armory-crest-brand-card.png`. Color contours use VTracer; the custom wordmark uses Potrace outlines with small straight-edge adjustments. The card's typography is outlined artwork rather than substituted live text.

| Original Palette Token | Hex |
| --- | --- |
| Vault Black | `#090E0B` |
| Charcoal | `#1B2026` |
| Graphite | `#2F343B` |
| Gunmetal | `#565D65` |
| Dark Silver | `#8A929B` |
| Silver White | `#E6EDDF` |
| Tactical Green | `#8AAD45` |
| Reticle Red | `#B54A43` |
| Field Olive | `#617340` |
| Structural Green | `#3E5949` |
| Junction Red | `#713831` |

All files are in `assets/concepts/logos/v15/`; earlier rounds are preserved. Application code and implementation assets are untouched. No application tests, builds, UI checks or commits were requested or run.
