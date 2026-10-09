# Weapon Database Landing Concepts — v1

Three visual directions for a military archive and classified-vault-inspired Weapon Database landing page. All reuse the exact adopted crest and original outlined wordmark from `assets/logos/v1/`, with the official green, charcoal, gunmetal, gray, white, and red palette.

Start with the [desktop and mobile comparison board](00-design-comparison.png). Its [SVG source](00-design-comparison.svg) contains all six layouts.

## Concepts

| Direction | Idea | Desktop | Mobile |
| --- | --- | --- | --- |
| 01 Armory Vault | Cinematic rifle display, bold stencil headline, catalog search, skins/optics/attachments preview, category shortcuts, and field notes | [PNG](01-armory-vault-desktop.png) · [SVG](01-armory-vault-desktop.svg) | [PNG](01-armory-vault-mobile.png) · [SVG](01-armory-vault-mobile.svg) |
| 02 Dossier Index | Search-first archive, angular equipment dossier, featured sword, category index, and personal collection/loadout entry | [PNG](02-dossier-index-desktop.png) · [SVG](02-dossier-index-desktop.svg) | [PNG](02-dossier-index-mobile.png) · [SVG](02-dossier-index-mobile.svg) |
| 03 Future Systems | Research hangar, drone showcase, emerging technology, autonomous systems, warfare history, blogs, and Loadout Lab | [PNG](03-future-systems-desktop.png) · [SVG](03-future-systems-desktop.svg) | [PNG](03-future-systems-mobile.png) · [SVG](03-future-systems-mobile.svg) |

Desktop layouts use a 1600 × 1000 canvas with a header, hero, compact category/editorial strip, and footer. Mobile layouts use a 430 × 1200 extended canvas to show the first-screen hero and its continuation through the footer. PNGs are exported at 2×: 3200 × 2000 desktop and 860 × 2400 mobile. The comparison board is 3600 × 2520.

## Product Direction

- Public catalog browsing for firearm models, swords, drones, and future systems
- Search by model, era, platform, or category
- Journal/blogs, warfare history, and emerging technology content
- Personal saved weapons and custom classes/loadouts after sign-in
- Loadout Lab for visual skins, scopes, optics, and attachments
- Consistent crest branding, clear search/actions, and compact account/navigation controls on mobile

The classification labels, serial-style metadata, evidence frames, and dossier treatments establish the visual tone. Catalog entries and imagery are sample content for the concepts.

## Typography And Layout

- Saira Stencil One: display headlines and archive headings
- Rajdhani: navigation, headings, buttons, and compact UI
- Barlow: readable descriptions and body copy
- JetBrains Mono: dossier IDs, classification tags, and metadata
- Original custom stencil wordmark: brand identity in every header

All three layouts include © 2026 Weapon Database, About, Contact, Terms, Privacy, and Piratechs.com in the footer. The intended implementation keeps the header sticky, adds smooth blur/transparency on scroll, and reveals a reduced-motion-aware scroll-to-top control after the hero.

## Editable Assets

Each SVG contains outlined typography and embedded hero artwork, making the visual portable across viewers. Copy and layout remain editable in the Python generators under [sources/](sources/). The original hero PNGs are in [assets/](assets/). The generators reference the approved logo/font package rather than duplicate or modify it.

The hero artwork was made with the built-in image-generation tool. The exact [prompt set](image-prompts.md) is included for later image rounds.

To regenerate layouts, use Python with `fonttools`, run `sources/01-armory-vault.py`, `sources/02-dossier-index.py`, `sources/03-future-systems.py`, then `sources/04-comparison-board.py` with `sources/` on the Python import path. SVGs can be exported to PNG at 144 DPI for the same 2× layout exports, or 108 DPI for the comparison board.

This round contains visual concepts. Application pages, authentication, catalog data, and the interactive weapon customizer remain implementation work after a design is selected.
