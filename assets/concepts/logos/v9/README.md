# Weapon Database — Armory Crest v9

This round returns to the v7 identity and blended gun/sword center, adding v8's fine black scope-to-sword separation. Thin black seams and even smaller muted red inlays detail the existing green crest border. The jet, bow, rifles, handle, and other colors follow v7; the green rear-jet changes from v8 are not included.

The requested brand card presents the crest and its wordmark alongside the palette and proposed font families.

| File | Purpose |
| --- | --- |
| `01-armory-crest-mark.svg` | Editable standalone crest with transparent surrounding canvas. |
| `01-armory-crest-lockup.svg` | Editable crest with two-line Weapon Database text for dark backgrounds. |
| `03-armory-crest-v9.png` | Reference-based visual refinement of v7. |
| `04-armory-crest-brand-card.png` | Finished landscape identity card with logo, wordmark, color swatches, and font pairing. |
| `brand-tokens.json` | Named palette values and font direction for later implementation. |
| `logo-generation-prompt.txt` | Exact built-in image generation instructions for the logo refinement. |
| `card-generation-prompt.txt` | Exact built-in image generation instructions for the card layout. |

| Palette | Hex | Role |
| --- | --- | --- |
| Vault Black | `#090E0B` | Background, equipment insets, and thin border seams |
| Field Olive | `#617340` | Equipment shells and grips |
| Tactical Green | `#8AAD45` | Dominant shield border and military accents |
| Structural Green | `#3E5949` | Recessed and supporting panels |
| Silver White | `#E6EDDF` | Blade, reticle, aircraft, bow, hardware, and lettering |
| Reticle Red | `#B54A43` | Small existing equipment details and tiny new border inlays |

| Typography | Role |
| --- | --- |
| Custom Stencil Lettering | The existing generated logo wordmark, preserved as artwork; it is not an identified font file. |
| [Saira Stencil One](https://github.com/Omnibus-Type/Saira) | Proposed display and stencil companion for headings, rather than a replacement for the existing wordmark. |
| [Rajdhani](https://github.com/itfoundry/rajdhani) | Proposed interface and database typography. |
| Arial Black / Impact / sans-serif | Current live-text fallback for the independent editable SVG lockup. |

The font pairing is a design proposal. Raster specimens on the card are visual approximations, not embedded font software. The original wordmark remains custom stencil artwork. Palette hex values are the intended brand tokens, rather than a claim that every antialiased raster pixel has that exact value.

SVGs are independent editable interpretations of the visual concept, not exact traces of the raster. Mark viewBox: `256 × 256`; lockup viewBox: `920 × 280`. They include accessible titles and descriptions, unique v9 IDs, and transparent surrounding canvases.

All new files are saved in `assets/concepts/logos/v9/`; earlier rounds are preserved. Verification, tests, builds, and application adoption are outside this requested identity-card round.
