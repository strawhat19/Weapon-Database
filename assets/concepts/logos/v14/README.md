# Weapon Database — Armory Crest v14

This round preserves the crest and custom stencil wordmark from the selected v13 brand card. It replaces the broad black presentation fields with the logo's grays: Charcoal `#1B2026` for the card canvas and Graphite `#2F343B` inside the shield. Colored equipment, silver details, green structural panels and tiny black equipment insets retain the source artwork.

The card shows the original arrangement with the crest above the two-line wordmark, plus the requested arrangement with the shield on the left and “Weapon” over “Database” on the right. Both arrangements use the same extracted crest and lettering. Earlier rounds are preserved.

| Files | Purpose |
| --- | --- |
| `01-armory-crest-mark.svg`, `.png` | Crest with a transparent surrounding canvas for icon and avatar use. |
| `02-armory-crest-stacked.svg`, `.png` | Crest above the original two-line wordmark, with a transparent surrounding canvas. |
| `03-armory-crest-shield-left-stacked.svg`, `.png` | Shield on the left and the two-line wordmark on the right, with a transparent surrounding canvas. |
| `04-armory-crest-brand-card.svg`, `.png` | Gray brand card containing both arrangements, palette and original font specimens. |
| `05-armory-crest-stacked-charcoal.svg`, `.png` | Stacked arrangement on Charcoal. |
| `06-armory-crest-shield-left-charcoal.svg`, `.png` | Shield-left arrangement on Charcoal. |
| `07-armory-crest-stacked-graphite.svg`, `.png` | Stacked arrangement on Graphite. |
| `08-armory-crest-shield-left-graphite.svg`, `.png` | Shield-left arrangement on Graphite. |
| `brand-tokens.json` | Palette, background roles and artwork format information. |
| `card-generation-prompt.txt` | Background and layout edit brief for this round. |

The authoritative source is `../v13/04-armory-crest-brand-card.png`. Source extraction and the gray treatment are shared across the final card, PNGs and SVGs; the crest and wordmark are not redrawn, regenerated or replaced with fallback fonts.

**SVG format:** These are self-contained raster-backed SVGs. They embed the same PNG artwork used by the matching exports, preserving the selected logo's shape and lettering. The SVG containers and placement can be edited, but the crest and custom wordmark are embedded pixels rather than traced, editable vector paths. Their detail is limited by the original raster resolution.

| Palette | Hex | Role |
| --- | --- | --- |
| Charcoal | `#1B2026` | Main gray canvas and background variant |
| Graphite | `#2F343B` | Broad shield field and background variant |
| Vault Black | `#090E0B` | Retained small equipment insets and original palette token |
| Gunmetal | `#565D65` | Gray hardware and border inlays |
| Dark Silver | `#8A929B` | Rails, grip wraps and border highlights |
| Silver White | `#E6EDDF` | Lettering and silver artwork token |
| Tactical Green | `#8AAD45` | Shield border, rifles and presentation accents |
| Reticle Red | `#B54A43` | Existing targeting and weapon details |
| Field Olive | `#617340` | Supporting military green token |
| Structural Green | `#3E5949` | Inner shield corner and side panels |
| Junction Red | `#713831` | Small rifle-to-sword junction details |

These are presentation tokens; retained source artwork includes its original raster shading. The wordmark remains custom stencil artwork. Saira Stencil One is the display companion and Rajdhani the interface/data companion shown in the card's original font specimens.

This is a concept round in `assets/concepts/logos/v14/`. Application code and implementation assets are untouched. No application tests, builds, UI checks or commits were requested or run.
