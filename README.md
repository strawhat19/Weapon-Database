# Weapon Database

A responsive, single-page frontend based on the approved Armory Vault v9 direction. It retains the official v23 crest, local brand fonts, brushed steel dark and light themes, and the oval specimen frame.

## Run locally

```sh
npm install
npm start
```

Expo starts the web app and prints its local URL. Open that URL on your computer, or use its LAN URL from a phone on the same network.

## Included

- Sticky header with mobile navigation, theme switch, saved-armory drawer, and inline account preview
- Hero specimen carousel with a draggable 3D rifle, catalog search, category filters, and weapon dossiers
- Visual loadout editor with named builds, finishes, optics, accessories, editing, and deletion
- Journal articles and weapon-history sections with inline dialogs
- Footer information dialogs, current-year copyright, Piratechs link, and scroll-to-top control
- Installable PWA metadata and an offline cache for a production web export

Only the landing page is implemented. The catalog is a small, explicitly configured sample collection; its concepts are labeled as design studies. Account controls explain the current local collection flow rather than simulating authentication.

The hero rifle is an original Three.js mesh modeled from the approved rifle image. It turns slowly with a gentle start, pauses for dragging or keyboard rotation, and resumes after a short idle delay. The pause/play control holds or resumes the view. Automatic rotation stops offscreen and in hidden tabs, and is disabled by default for reduced motion. Drag with a mouse or finger to rotate freely; drag near the viewport edge or twist with two fingers to roll. Keyboard controls are arrow keys for rotation, Q/E for roll, and Home/R to reset. The skin swatches change its finish. The original PNG remains visible while loading or when WebGL is unavailable.

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

This implementation was authored without running a build, tests, or UI verification, following the project working agreements. Review it locally before publishing.
