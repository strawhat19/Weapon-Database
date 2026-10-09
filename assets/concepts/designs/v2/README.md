# Armory Vault — Steel Refinement

Two refined landing-page concepts pair an open, floating rifle hero with a quieter editorial collection index. Improved spacing and typography give the content more room, while the dark brushed-steel and light silver-steel themes offer distinct contrast. Mobile keeps the same hierarchy with a two-column category grid.

| Artwork | Editable SVG | PNG |
| --- | --- | --- |
| Dark desktop | [SVG](01-armory-vault-dark-desktop.svg) | [PNG](01-armory-vault-dark-desktop.png) |
| Dark mobile | [SVG](01-armory-vault-dark-mobile.svg) | [PNG](01-armory-vault-dark-mobile.png) |
| Light desktop | [SVG](02-armory-vault-light-desktop.svg) | [PNG](02-armory-vault-light-desktop.png) |
| Light mobile | [SVG](02-armory-vault-light-mobile.svg) | [PNG](02-armory-vault-light-mobile.png) |
| Dark desktop + mobile | [SVG](03-armory-vault-dark-pair.svg) | [PNG](03-armory-vault-dark-pair.png) |
| Light desktop + mobile | [SVG](04-armory-vault-light-pair.svg) | [PNG](04-armory-vault-light-pair.png) |
| Both themes | [SVG](00-armory-vault-steel-comparison.svg) | [PNG](00-armory-vault-steel-comparison.png) |

Desktop layouts are 1600 × 1080 and mobile layouts are 430 × 1180, with PNGs exported at 2×. Each 2240 × 1440 paired board places mobile immediately to the right of desktop and exports at 1.5×. The combined comparison is 2240 × 2880 at 1×.

The approved crest remains native vector artwork. Layout text uses outlined glyphs from the official bundled fonts. The steel textures and isolated rifle are generated raster assets; their prompts are recorded in [image-prompts.md](image-prompts.md).

Editable layout sources: [01-armory-vault-steel.py](sources/01-armory-vault-steel.py) and [design_helpers.py](sources/design_helpers.py). Theme values are supplied in [design-tokens.json](design-tokens.json) and [themes.scss](themes.scss).

Image assets: [dark brushed steel](assets/dark-brushed-steel.png), [light brushed steel](assets/light-brushed-steel.png), and [isolated rifle](assets/armory-rifle-isolated.png).

These files are reviewable design concepts. Application implementation, tests, and builds remain separate.
