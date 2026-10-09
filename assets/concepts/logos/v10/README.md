# Weapon Database — Armory Crest v10

This round moves equipment surfaces into a neutral metal palette while retaining the existing black insets, tiny red details, green shield border, blended rifle/sword center, and black scope separation. The card also adds a horizontal crest-and-wordmark arrangement.

| File | Purpose |
| --- | --- |
| `01-armory-crest-mark.svg` | Editable standalone crest with transparent surrounding canvas. |
| `01-armory-crest-lockup.svg` | Editable crest beside the two-line Weapon Database wordmark. |
| `02-armory-crest-horizontal.svg` | Editable horizontal arrangement: crest on the left, Weapon Database on one line to its right. |
| `03-armory-crest-gunmetal.png` | Built-in image generation refinement of v9 with gray equipment. |
| `04-armory-crest-brand-card.png` | Identity card containing the original stacked logo presentation, new horizontal lockup, updated palette, and font pairing. |
| `brand-tokens.json` | Named palette and proposed font tokens. |
| `logo-generation-prompt.txt` | Exact instructions for the raster logo edit. |
| `card-generation-prompt.txt` | Exact instructions for the expanded card. |

Rifle surfaces use gunmetal and dark silver with the prior black receiver, magazine, stock, and handguard details. The sword grip and formerly green bow details use neutral grays. Recessed shield panels use graphite and charcoal. The green shield edge remains an identity accent, while the major equipment area becomes neutral.

| Palette | Hex | Role |
| --- | --- | --- |
| Vault Black | `#090E0B` | Background, insets, seams, and scope separation |
| Charcoal | `#1B2026` | Dark grip and supporting interior surfaces |
| Graphite | `#2F343B` | Recessed armor and secondary equipment panels |
| Gunmetal | `#565D65` | Main rifle shells and grip surfaces |
| Dark Silver | `#8A929B` | Equipment edges, rail surfaces, and grip hardware |
| Silver White | `#E6EDDF` | Blade, reticle, jet, bow, guard, pommel, and lettering |
| Tactical Green | `#8AAD45` | Shield border and restrained presentation accents |
| Reticle Red | `#B54A43` | Tiny targeting, weapon, and border details |

| Typography | Role |
| --- | --- |
| Custom Stencil Lettering | Existing generated wordmark, preserved as artwork rather than an identified font file. |
| [Saira Stencil One](https://github.com/Omnibus-Type/Saira) | Proposed display/stencil companion. |
| [Rajdhani](https://github.com/itfoundry/rajdhani) | Proposed interface/data family. |
| Arial Black / Impact / sans-serif | Live-text fallback for the independent editable SVG lockups. |

The PNG artwork is made with the built-in image generation tool. Raster font specimens are visual approximations and palette hex values are intended tokens. SVGs are independent editable interpretations, not exact raster traces. Each has accessible titles and descriptions and unique v10 IDs. The mark uses a `256 × 256` viewBox, the two-line lockup `920 × 280`, and the horizontal arrangement a wider viewBox appropriate to one-line text.

All new assets are saved in `assets/concepts/logos/v10/`. Earlier rounds are preserved. No application adoption, verification, tests, or builds are included in this requested design round.
