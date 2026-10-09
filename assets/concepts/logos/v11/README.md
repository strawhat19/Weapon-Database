# Weapon Database — Armory Crest v11

Two equipment-finish variants continue v10. Both retain the gray bow/arrow and sword handle, green shield border, tiny red accents, black insets, scope separation, and blended rifle-over-sword center. Subtle dark silver rear stabilizers and a gunmetal aft panel break up the fighter jet's white rear while preserving its silver silhouette.

| Variant | Idea | Likely use |
| --- | --- | --- |
| Green Rifles | Restores the green rifle shells, with restrained gray rail, barrel, magazine, and stock hardware. | Main military identity, avatar, app icon, or header. |
| Gray Rifles | Keeps gunmetal shells with small muted green rail and stock accents. | Alternate metal finish, compact badges, or darker header treatments. |

| File | Purpose |
| --- | --- |
| `01-armory-crest-green-mark.svg` | Editable green rifle crest with transparent surrounding canvas. |
| `01-armory-crest-green-lockup.svg` | Editable green crest beside the two-line wordmark. |
| `01-armory-crest-green-horizontal.svg` | Editable green crest with Weapon Database on one line to its right. |
| `02-armory-crest-gray-mark.svg` | Editable gray rifle crest with transparent surrounding canvas. |
| `02-armory-crest-gray-lockup.svg` | Editable gray crest beside the two-line wordmark. |
| `02-armory-crest-gray-horizontal.svg` | Editable gray crest with Weapon Database on one line to its right. |
| `03-armory-crest-green.png` | Built-in image generation refinement: green rifles with gray accents. |
| `04-armory-crest-gray.png` | Built-in image generation refinement: gray rifles with green accents. |
| `05-armory-crest-green-brand-card.png` | Green variant with stacked/horizontal logo specimens, palette, and font pairing. |
| `06-armory-crest-gray-brand-card.png` | Gray variant with stacked/horizontal logo specimens, palette, and font pairing. |
| `brand-tokens.json` | Shared palette, variant roles, and proposed typography. |
| `green-logo-generation-prompt.txt` | Exact green raster edit instructions. |
| `gray-logo-generation-prompt.txt` | Exact gray raster edit instructions. |
| `green-card-generation-prompt.txt` | Exact green card instructions. |
| `gray-card-generation-prompt.txt` | Exact gray card instructions. |

| Palette | Hex | Role |
| --- | --- | --- |
| Vault Black | `#090E0B` | Canvas, insets, seams, and scope separation |
| Charcoal | `#1B2026` | Dark grip and supporting surfaces |
| Graphite | `#2F343B` | Recessed armor and secondary panels |
| Gunmetal | `#565D65` | Gray rifle shells, neutral equipment details, jet aft panel |
| Dark Silver | `#8A929B` | Rail edges, hardware, grip wraps, jet rear stabilizer panels |
| Silver White | `#E6EDDF` | Blade, scope, jet silhouette, bow, guard, pommel, lettering |
| Tactical Green | `#8AAD45` | Shield edge, green raster rifle shells, presentation accents |
| Reticle Red | `#B54A43` | Tiny targeting, weapon, and border details |
| Field Olive | `#617340` | Green editable rifle shells and muted gray-variant accents |
| Structural Green | `#3E5949` | Muted gray-variant stock details |

The existing custom stencil wordmark remains artwork. [Saira Stencil One](https://github.com/Omnibus-Type/Saira) is the proposed display companion; [Rajdhani](https://github.com/itfoundry/rajdhani) is the proposed interface/data family. Editable SVG lockups use Arial Black / Impact / sans-serif as live-text fallbacks.

Raster logos and cards use the built-in image generation tool. Card font specimens are visual approximations; hex values are intended palette tokens. SVGs are independent editable interpretations rather than exact raster traces, with accessible titles/descriptions and unique v11 IDs.

All new assets are in `assets/concepts/logos/v11/`. Earlier rounds are preserved. This round changes concept assets only; no application adoption, tests, builds, validation, or UI checks were requested or run.

