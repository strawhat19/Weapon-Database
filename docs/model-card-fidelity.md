# Weapon Card Matching

The four non-ARX firearms use custom exterior meshes built from the current card images. ARX-27 still uses `createRifleModel`; its source and attachment layout values were preserved.

| Entry | Reference | Reconstructed Features |
| --- | --- | --- |
| VX-9 | `public/media/images/vx-9-studio.webp` | Open triangular stock, faceted receiver, swept grip, curved ribbed magazine, horizontal vents, aperture sights and short muzzle |
| Bastion-12 | `public/media/images/bastion-12-studio.webp` | Contoured shoulder stock and wrist, compact action, recessed port, oval ribbed pump, parallel barrel/tube and sights |
| Sentinel SR-8 | `public/media/images/sentinel-sr8-studio.webp` | Adjustable stock, cheekrest, vented chassis, bolt handle, box magazine, long barrel, large low-mounted scope and deployed bipod |
| Kestrel P-9 | `public/media/images/kestrel-p9-studio.webp` | Traced slide/frame outline, open ejection notch, curved trigger, textured grip panels, underside rail and compact iron sights |

`gunGeometry.ts` batches the actual volumetric geometry. `referenceSurfaces.ts` maps the existing card images onto lateral surfaces for Graphite VX-9, Desert Bastion, Arctic Sentinel and Urban Kestrel. The card coordinates use a separate `uv2` channel; grain uses `uv1`, and alternative finishes use the procedural finish UVs. Texture failures restore those procedural materials. Late texture loads redraw paused viewers, and owned textures/materials/geometries are disposed with each model.

The card images provide one illustrated view, so these are approximate exterior reconstructions. Unpictured depth and rear details are inferred; the meshes do not represent verified manufactured weapons or functional internals. Scope, bipod, light, cheekrest and magazine mount coordinates were fitted to the reconstructed bodies.

The reverse-engineer-anything skill and its runtime-observation guidance were read. Its source-available workflow directs reconstruction through normal coding tools. No external model was acquired or decompiled.

## Verification

- TypeScript `tsc --noEmit` completed with exit code 0
- All four models rendered with `data-state="ready"` in the running local app and were visually compared with their card references
- Kestrel was also observed at a rotated angle, switched to Olive and back to Urban, and rendered with a reflex sight, suppressor, light and extended magazine
- Source audit traced every permitted equipment option through its geometry branch and checked relative model/attachment centering and resource disposal
- ARX's original builder has no Git diff and remains outside the new reference-surface path

Local comparison captures are saved under `C:/Users/massa/.codex/visualizations/2026/10/12/01a13148-bf56-77a3-bb73-ecae930ccb54/model-fidelity/`. No production deployment was performed.

## Vigil MR-14

The `vigil-mr14` catalog entry uses a new `marksman` model with an open adjustable stock, beveled receivers, ejection-port recess, genuine handguard vents, textured grip, ribbed box magazine and continuous rails. Its volumetric exterior uses procedural PBR materials throughout. The default configuration has a precision scope and deployed bipod; all six firearm attachment slots and existing device loadout storage are available.

`scripts/marksmanStudio.ts` renders `public/media/images/vigil-mr14-studio.png` directly from `createWeaponModel` with the catalog's Graphite/default configuration. The ten model-specific attachment thumbnails come from `createPartModel`; the iron sights share their exact assembly with the rifle. Thumbnail framing brings the separated sight pair together for readability without changing runtime geometry.

The generated card is 1800×720; attachment PNGs are 400×280. All 15 outputs, including four oblique proofs, decoded successfully with transparent backgrounds, nonempty content and padded bounds. Light/dark proofs reuse the viewer's lighting and exposure without studio ambient occlusion. The default model has 11 material-batched meshes and 128,932 triangles; the equipped proof has 12 meshes and 136,484 triangles.

Source review traced catalog selection, defaults, attachment fitting and local save/reload. Generated card, attachment contact sheet and oblique renders were visually reviewed. No app UI checks, builds or tests were run for this addition. Evidence and render metadata are under `C:/Users/massa/.codex/visualizations/2026/10/12/01a13148-bf56-77a3-bb73-ecae930ccb54/marksman-fidelity/`.

## Medieval Swords

| Entry | Model | Exterior |
| --- | --- | --- |
| Ironwake Greatsword | `greatsword` | Straight fullered two-hand blade, sweeping quillons, broad leather wraps and wheel pommel |
| Ravenfall Falchion | `falchion` | Broad curved blade with clipped tip, protective side ring, wrapped grip and pear pommel |

`buildMedievalSword.ts` builds volumetric steel blades with recessed channels on both faces. Dense blade stations and longitudinally averaged normals retain the hard bevel/fuller edges while removing triangle shading seams. Guards use continuous tapered curves; leather grips use flat beveled strips. New-model materials add brushed steel, aged brass and matte leather grain without changing the existing models.

Each sword has a blade-fitted scabbard with hollow throat and brass fittings, a pommel tassel, and an ornate guard. These share the existing single decoration slot. All nine finishes customize wraps and decorations while steel blades retain their material. Sword controls use Swordsmith, Decorations and Hilt Finish labels; device saving uses the existing loadout schema.

`scripts/medievalSwordStudio.ts` renders both catalog cards from their exact default models: Silver Ironwake and Graphite Ravenfall. Six thumbnails come from the same decoration assemblies. Default models use six material-batched meshes each, with 13,348 and 13,144 triangles respectively.

Both 1800×760 cards, six 400×280 thumbnails, and fourteen decoration/camouflage/theme proofs were generated and visually reviewed. All 22 outputs decoded with transparent, nonempty, padded bounds. Theme proofs use the actual viewer light rig without offline ambient occlusion or softboxes. Source review covered registration, finish application, decoration fitting, resource disposal, accessible controls and local save/reload. No app UI checks, builds or tests were run for this addition.

Evidence, source/asset hashes, paired preview and contact sheets are saved under `C:/Users/massa/.codex/visualizations/2026/10/12/01a13148-bf56-77a3-bb73-ecae930ccb54/sword-fidelity/`. The reverse-engineer-anything skill's source-available workflow was applied through normal repository tools; no external sword model was acquired or decompiled.
