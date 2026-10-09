# Weapon Database Official Identity — v1

The adopted Armory Crest is the final artwork from `assets/concepts/logos/v23/`. The official standalone SVG and PNG are copied unchanged, including the final shield-panel spacing refinement. The original concept folders remain available as design history.

## Logo Assets

Every logo has a transparent surrounding canvas and matching SVG/PNG files. The SVGs contain native vector artwork, and the wordmarks retain the original custom stencil outlines from v15.

| Asset | SVG | PNG | Use |
| --- | --- | --- | --- |
| Exact adopted crest | [01-armory-crest-mark.svg](01-armory-crest-mark.svg) | [PNG](01-armory-crest-mark.png) | Standalone crest |
| Stacked | [02-armory-crest-stacked.svg](02-armory-crest-stacked.svg) | [PNG](02-armory-crest-stacked.png) | Crest above two-row lettering |
| Shield left, two rows | [03-armory-crest-shield-left-stacked.svg](03-armory-crest-shield-left-stacked.svg) | [PNG](03-armory-crest-shield-left-stacked.png) | Crest beside stacked Weapon / Database |
| Horizontal | [04-armory-crest-horizontal.svg](04-armory-crest-horizontal.svg) | [PNG](04-armory-crest-horizontal.png) | Crest beside one-row lettering |
| Two-row wordmark | [05-weapon-database-wordmark.svg](05-weapon-database-wordmark.svg) | [PNG](05-weapon-database-wordmark.png) | Lettering alone |
| Horizontal wordmark | [06-weapon-database-wordmark-horizontal.svg](06-weapon-database-wordmark-horizontal.svg) | [PNG](06-weapon-database-wordmark-horizontal.png) | One-row lettering alone |

The main lockups use Silver White lettering. Matching dark-lettering assets are in [variants/](variants/) for light backgrounds. The crest itself is identical in every layout and color theme.

## Brand Cards

The cards preserve the approved crest, original wordmark shapes, and actual crest colors. Card labels and type specimens are outlined, so the SVGs render independently of installed fonts. Each card includes a 3600 × 2400 PNG export.

| Card | SVG | PNG |
| --- | --- | --- |
| Charcoal brand card | [01-armory-crest-brand-card-charcoal.svg](cards/01-armory-crest-brand-card-charcoal.svg) | [PNG](cards/01-armory-crest-brand-card-charcoal.png) |
| Graphite brand card | [02-armory-crest-brand-card-graphite.svg](cards/02-armory-crest-brand-card-graphite.svg) | [PNG](cards/02-armory-crest-brand-card-graphite.png) |
| Light brand card | [03-armory-crest-brand-card-light.svg](cards/03-armory-crest-brand-card-light.svg) | [PNG](cards/03-armory-crest-brand-card-light.png) |
| Palette and themes | [04-palette-and-themes.svg](cards/04-palette-and-themes.svg) | [PNG](cards/04-palette-and-themes.png) |
| Typography and logo arrangements | [05-typography-and-lockups.svg](cards/05-typography-and-lockups.svg) | [PNG](cards/05-typography-and-lockups.png) |

## Palette And Themes

[palettes/palette.json](palettes/palette.json) records all ten crest colors with names, hexadecimal values, RGB values, and roles. [brand-tokens.json](brand-tokens.json) combines the palette, typography, and theme definitions.

| Theme | Canvas | Lettering |
| --- | --- | --- |
| Charcoal — default | `#17181A` | `#F8F8F8` |
| Graphite | `#565B64` | `#F8F8F8` |
| Light | `#F8F8F8` | `#17181A` |

[themes/](themes/) contains JSON, CSS, and SCSS definitions. Use `data-weapon-theme="charcoal"`, `"graphite"`, or `"light"` on a surrounding layout. The theme variables control the surrounding canvas and interface; keep the crest's original colors and proportions.

## Fonts

[fonts/](fonts/) includes eight original TTF files, local `@font-face` definitions, source metadata, and the corresponding OFL licenses.

| Role | Family | Included Weights | CSS Family |
| --- | --- | --- | --- |
| Display companion | Saira Stencil One | 400 | `Weapon Saira Stencil One` |
| Headings and UI | Rajdhani | 400, 600, 700 | `Weapon Rajdhani` |
| Body text | Barlow | 400, 500, 600 | `Weapon Barlow` |
| Data and identifiers | JetBrains Mono | 400 | `Weapon JetBrains Mono` |

The logo lettering is custom outlined artwork. Use the wordmark SVGs for the logo; use the font files for supporting text. See [fonts/README.md](fonts/README.md) for installation, stylesheet use, sources, and license locations.

[brand-manifest.json](brand-manifest.json) records source paths, export dimensions, and SHA-256 identifiers for the unchanged official crest masters.
