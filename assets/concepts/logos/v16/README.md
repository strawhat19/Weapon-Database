# Weapon Database — Armory Crest v16

This round focuses only on refining the selected v15 crest. It rebuilds the artwork with native SVG geometry, retaining the green shield, sword, crossed rifles, segmented scope, bow and jet, and the current sampled colors. It is a deliberate geometric cleanup of the selected design.

| File | Purpose |
| --- | --- |
| `01-armory-crest-mark.svg` | Editable vector master, 788 × 914 viewBox, with a transparent surrounding canvas |
| `01-armory-crest-mark.png` | 1576 × 1828 transparent PNG rendered directly from that SVG |
| `brand-tokens.json` | Current palette and artwork format details |

The shield, green panels, border hardware, scope segments, rifles, stock openings, fasteners and magazine rails use shared shapes reflected across x = 394. The sword and its guard, grip and pommel are centered on that axis. Each jet wing is also an exact reflection about its own centerline; the bow limbs and straight string are balanced about the arrow shaft. The bow and jet remain distinct upper motifs from the approved design.

The rebuilt paths replace traced micro-contours with straight edges, circular arcs, consistent repeated rail teeth, smooth magazine curves, inset stock hardware and clean receiver openings. Connected green parts overlap to avoid hairline rendering seams. The SVG contains no embedded images or font dependencies; named groups and reusable mirrored components remain editable. The PNG uses the same master artwork.

| Color | Hex |
| --- | --- |
| Crest Green | `#81BC34` |
| Structural Green | `#375540` |
| Silver White | `#F8F8F8` |
| Hardware Gray | `#859398` |
| Gunmetal | `#565B64` |
| Magazine Charcoal | `#17181A` |
| Shield Field | `#020302` |
| Hardware Black | `#000000` |
| Reticle Red | `#E5302B` |
| Junction Pin | `#372126` |

Reference: `../v15/01-armory-crest-mark.svg` and `../v15/01-armory-crest-mark.png`, plus the supplied annotated image. Earlier rounds and application assets are preserved.
