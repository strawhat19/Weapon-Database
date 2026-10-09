# Weapon Database — Armory Crest v8

This round compares two treatments of the sword/rifle intersection. Both add subtle green rear-jet details and black separation where the scope spoke meets the silver sword.

| Direction | Files | Treatment |
| --- | --- | --- |
| 01 — Blended Sword | `01-armory-crest-blended-mark.svg`, `01-armory-crest-blended-lockup.svg`, `01-armory-crest-blended.png` | Keeps the joined center where the green crossed rifles cover the sword above its handle. The upper blade and lower hilt share the composition with the guns. |
| 02 — Continuous Sword | `02-armory-crest-continuous-mark.svg`, `02-armory-crest-continuous-lockup.svg`, `03-armory-crest-continuous-clear.png` | Shows a continuous silver blade down through the rifle intersection to the crossguard. Fine black edge separation keeps the sword readable in front of the green rifles. |

The merged center in earlier generated artwork came from overlapping motifs; the continuous-sword treatment tests a clearer reading of the blade as one complete weapon. Both versions retain the same shield, bow, rifle positions, reticle, handle, wordmark, and black/green/silver/red palette. A narrow black gap separates the nearby scope spoke from the blade. The fighter jet gets small green tailplane or exhaust accents while remaining predominantly silver.

| Color | Hex |
| --- | --- |
| Vault Black | `#090E0B` |
| Field Olive | `#617340` |
| Tactical Green | `#8AAD45` |
| Structural Green | `#3E5949` |
| Archive Light / Silver White | `#E6EDDF` |
| Reticle Red | `#B54A43` |

The PNG variants began as separate built-in image generation edits of `../v7/03-armory-crest-refined-ring.png`. Their exact prompts are saved in `blended-generation-prompt.txt` and `continuous-generation-prompt.txt`. The first continuous preview, `02-armory-crest-continuous.png`, is preserved as an intermediate. Its central blade overlap was refined into `03-armory-crest-continuous-clear.png` using `continuous-cleanup-prompt.txt`.

SVGs are independent editable interpretations, not exact traces of the generated raster. Mark viewBoxes are `256 × 256`; lockup viewBoxes are `920 × 280`. Each has accessible titles and descriptions, unique variant IDs, and transparent surrounding canvas. Wordmarks remain live text using Arial Black, Impact, and sans-serif fallbacks.

New files are saved in `assets/concepts/logos/v8/`; earlier rounds are preserved. Verification, tests, builds, and application adoption are outside this requested comparison round.
