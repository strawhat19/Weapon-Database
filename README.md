# Weapon Database

A responsive, single-page frontend based on the approved Armory Vault v9 direction. It retains the official v23 crest, local brand fonts, brushed steel dark and light themes, and the oval specimen frame. Guns, swords, drones, and crossbows.

## Run locally

```sh
npm install
npm start
```

Expo starts the web app and prints its local URL. Open that URL on your computer, or use its LAN URL from a phone on the same network.

## Included

- Sticky header with mobile navigation, theme switch, saved-armory drawer, and inline account preview
- Hero specimen carousel with twelve draggable 3D models, catalog search, category filters, and weapon dossiers
- Gunsmith loadout editor with independent attachment slots, original part thumbnails, rotating 3D inspection, zoom, named builds, editing, and deletion
- Journal articles and weapon-history sections with inline dialogs
- Footer information dialogs, current-year copyright, Piratechs link, and scroll-to-top control
- Installable PWA metadata and an offline cache for a production web export

Only the landing page is implemented. The catalog is a small, explicitly configured sample collection; its concepts are labeled as design studies. Account controls explain the current local collection flow rather than simulating authentication.

The 3D collection includes the original ARX-27 rifle, VX-9 compact SMG, Bastion-12 shotgun, Sentinel SR-8 precision rifle, and Kestrel P-9 handgun. The collection also includes Aurelius Longsword, Ronin Katana, Crescent Saber, Kestrel Quad, Peregrine Wing, Ranger Recurve, and Vanguard Compound. Each is an original exterior design study. Both the hero carousel and Loadout Lab use interactive Three.js meshes. Nine finishes include olive, silver, graphite, desert, woodland, arctic, urban, digital, and tiger; camouflage patterns are applied as textures to the painted surfaces. Each model turns slowly with a gentle start, pauses for dragging or keyboard rotation, and resumes after a short idle delay. The pause/play control holds or resumes the view. Automatic rotation stops offscreen and in hidden tabs, and is disabled by default for reduced motion. Drag with a mouse or finger to rotate freely; drag near the viewport edge or twist with two fingers to roll. Keyboard controls are arrow keys for rotation, Q/E for roll, and Home/R to reset. The skin swatches change its finish. Equipment controls change the actual 3D meshes in both previews while preserving the viewing angle and pause state. Gun builds can combine optics, muzzle parts, underbarrels, side rail lights, raised cheek rests, and extended magazine bodies, with choices tailored to each model. Crossbows offer optics, underbarrels and rail lights. Every non-default part has an isolated 3D inspector using the same geometry that mounts on the weapon. Equip and Remove affect one slot at a time; Reset Parts restores the factory configuration. Zoom buttons and pinch gestures let you examine the mounted build. Swords offer display scabbards, tassels and ornate guards; drones offer camera pods, cargo cases and landing kits. Saved configurations retain every slot. Legacy single-attachment records resolve into the corresponding slot without overwriting the original data; an explicitly empty slot takes precedence over its legacy value. Each model has catalog artwork used as an image preview when WebGL is unavailable.

## Local data

The app stores saved weapons and loadouts in browser localStorage under `weapon-database:v1:armory`; the theme uses `weapon-database:v1:theme`. Stored records use app-owned IDs and a persistent record counter. Corrupt or inaccessible storage produces a message and does not overwrite the existing collection.

The storage interface has a React Native AsyncStorage adapter for future native views. This implementation targets responsive web and PWA; it does not include native screens. No Firebase, remote database, authentication service, or analytics is connected.

Later, replace the local operations in `src/api/` with Firebase-backed operations while preserving the shared context contracts. `src/shared/config.ts` controls local storage and the sample catalog.

## Structure

- `app/`: one thin route, shared providers, and the HTML document
- `src/components/`: component folders with rendering, hooks, and Sass
- `src/shared/`: catalog, models, storage adapters, theme, and armory state
- `src/api/`: frontend data interfaces for future backend integration
- `public/media/`: unchanged official SVGs, fonts, approved textures, and imagery (kept outside Metro's reserved `/assets/` URL)
- `assets/concepts/`: original design rounds, preserved

## Static hosting / PWA

The tab title is `Weapon Database`. App icon alternatives are saved in `assets/logos/v1/app-icons/` as SVG and PNG, with production copies in `public/media/brand/app-icons/`. Set `appIconStyle` in `src/shared/config.ts` to `transparent`, `steel`, or `steel-crest` and reload to try the corresponding favicon, Apple touch icon, and PWA manifest. `steel-crest`, with the v2 crest-shaped silver backing, is the current selection.

```sh
npm run export
```

Serve the generated `dist/` directory over HTTPS (or localhost). The service worker is registered only in production and caches the landing page, its bundles, and local assets after the first successful visit. Exporting for a subdirectory can use Expo's supported base URL configuration.

The Gunsmith update is checked with TypeScript and targeted browser verification of equipment selection, 3D inspection, removal, and saved-build restoration. Builds remain local to the browser.
