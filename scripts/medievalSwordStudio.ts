import * as THREE from 'three';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getEquipmentDefaults, getEquipmentOptions } from '../src/shared/catalog/equipment';
import { createPartModel, createWeaponModel } from '../src/components/WeaponModel/buildWeapon';
import type { SkinId, WeaponModelId, ModelEquipment, CustomizationId } from '../src/types/types';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

const models: { id: WeaponModelId; skin: SkinId; file: string }[] = [
  { id: `greatsword`, skin: `silver`, file: `ironwake-greatsword` },
  { id: `falchion`, skin: `graphite`, file: `ravenfall-falchion` },
];
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.domElement.id = `medieval-sword-studio-canvas`;
document.getElementById(`medieval-sword-studio-preview`)?.append(renderer.domElement);
const environmentScene = new RoomEnvironment();
const environmentGenerator = new THREE.PMREMGenerator(renderer);
const environment = environmentGenerator.fromScene(environmentScene, .04);
scene.environment = environment.texture;
environmentScene.dispose();
environmentGenerator.dispose();
const key = new THREE.DirectionalLight();
const fill = new THREE.DirectionalLight();
const rim = new THREE.DirectionalLight();
const hemisphere = new THREE.HemisphereLight();
RectAreaLightUniformsLib.init();
const softbox = new THREE.RectAreaLight(0xf3f4f6, 7, 4.4, 4.8);
const edgebox = new THREE.RectAreaLight(0xd6e6f4, 3, 7, 1.2);
softbox.position.set(-1.1, 2.4, 3.8);
edgebox.position.set(2, -3, 2.6);
softbox.lookAt(.4, 0, 0);
edgebox.lookAt(.5, 0, 0);
scene.add(key, fill, rim, hemisphere, softbox, edgebox);
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .01, 1000);
const renderTarget = new THREE.WebGLRenderTarget(1800, 760, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, renderTarget);
const ambientOcclusion = new SSAOPass(scene, camera, 1800, 760, 64);
ambientOcclusion.kernelRadius = .09;
ambientOcclusion.minDistance = .00006;
ambientOcclusion.maxDistance = .015;
ambientOcclusion.ssaoMaterial.defines[`PERSPECTIVE_CAMERA`] = 0;
composer.addPass(new RenderPass(scene, camera));
composer.addPass(ambientOcclusion);
composer.addPass(new OutputPass());
const status = document.getElementById(`medieval-sword-studio-status`);
const output = document.getElementById(`medieval-sword-studio-output`) as HTMLTextAreaElement;
const button = document.getElementById(`medieval-sword-studio-generate`) as HTMLButtonElement;
type Presentation = ReturnType<typeof createWeaponModel>;
type Result = { file: string; data: string; width: number; height: number; triangles: number; meshes: number; bounds: number[]; camera: number[]; lighting: string };
const render = (presentation: Presentation, file: string, width: number, height: number, view: readonly [number, number, number], margin = 1.13, viewerTheme?: `light` | `dark`, angle = 6): Result => {
  const viewerLighting = Boolean(viewerTheme);
  key.color.setHex(viewerLighting ? 0xf5f4ea : 0xf2f2ed);
  fill.color.setHex(viewerLighting ? 0xb8cbd2 : 0xcbdce9);
  rim.color.setHex(viewerLighting ? 0xe0ead6 : 0xf3f0de);
  hemisphere.color.setHex(viewerLighting ? 0xcbd5de : 0xe5ecf0);
  hemisphere.groundColor.setHex(viewerLighting ? 0x263027 : 0x303934);
  softbox.intensity = viewerLighting ? 0 : 7;
  edgebox.intensity = viewerLighting ? 0 : 3;
  key.intensity = viewerLighting ? 3.2 : .4;
  fill.intensity = viewerLighting ? 2 : .15;
  rim.intensity = viewerLighting ? 2.8 : 1.4;
  hemisphere.intensity = viewerLighting ? 1 : .4;
  key.position.set(-4, viewerLighting ? 7 : 8, viewerLighting ? 8 : 9);
  fill.position.set(viewerLighting ? 5 : 6, viewerLighting ? 2 : 3, viewerLighting ? 4 : 5);
  rim.position.set(viewerLighting ? 0 : 1, 5, viewerLighting ? -6 : -7);
  renderer.toneMappingExposure = viewerTheme === `dark` ? 1.2 : viewerTheme === `light` ? 1.05 : 1.1;
  scene.environmentIntensity = viewerTheme === `dark` ? 1 : viewerTheme === `light` ? .85 : .35;
  presentation.object.rotation.z = THREE.MathUtils.degToRad(viewerLighting ? 8 : angle);
  renderer.setSize(width, height);
  const bounds = new THREE.Box3().setFromObject(presentation.object);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const distance = Math.max(size.length(), 1) * 3;
  presentation.object.position.sub(center);
  scene.add(presentation.object);
  camera.position.set(...view).normalize().multiplyScalar(distance);
  camera.near = distance * .3;
  camera.far = distance * 1.7;
  ambientOcclusion.ssaoMaterial.uniforms[`cameraNear`].value = camera.near;
  ambientOcclusion.ssaoMaterial.uniforms[`cameraFar`].value = camera.far;
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld(true);
  const framed = new THREE.Box3().setFromObject(presentation.object);
  const projected: THREE.Vector3[] = [];
  for (const x of [framed.min.x, framed.max.x]) for (const y of [framed.min.y, framed.max.y]) {
    for (const z of [framed.min.z, framed.max.z]) projected.push(new THREE.Vector3(x, y, z).applyMatrix4(camera.matrixWorldInverse));
  }
  const horizontal = Math.max(...projected.map(point => Math.abs(point.x)));
  const vertical = Math.max(...projected.map(point => Math.abs(point.y)));
  const halfWidth = Math.max(horizontal, vertical * width / height) * margin;
  camera.left = -halfWidth;
  camera.right = halfWidth;
  camera.top = halfWidth * height / width;
  camera.bottom = -camera.top;
  camera.updateProjectionMatrix();
  if (viewerLighting) { renderer.setRenderTarget(null); renderer.render(scene, camera); }
  else { composer.setSize(width, height); composer.render(); }
  let triangles = 0, meshes = 0;
  presentation.object.traverse(object => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    meshes += 1;
    triangles += (mesh.geometry.index?.count ?? mesh.geometry.getAttribute(`position`).count) / 3;
  });
  const result = { file, width, height, meshes, triangles, bounds: size.toArray(), camera: [...view], lighting: viewerTheme ? `Viewer ${viewerTheme}` : `Studio AO`, data: renderer.domElement.toDataURL(`image/png`) };
  scene.remove(presentation.object);
  presentation.dispose();
  return result;
};
const addPreview = (result: Result) => {
  const image = document.createElement(`img`);
  image.src = result.data;
  image.alt = result.file;
  image.className = `medieval-sword-studio-result`;
  image.id = `medieval-sword-studio-result-${result.file.replace(/\W/g, `-`)}`;
  document.getElementById(`medieval-sword-studio-results`)?.append(image);
};
button.disabled = false;
button.addEventListener(`click`, async () => {
  button.disabled = true;
  document.getElementById(`medieval-sword-studio-results`)?.replaceChildren();
  const results: Result[] = [];
  const failures: { file: string; reason: string }[] = [];
  const configurations: { model: WeaponModelId; skin: SkinId; defaults: ModelEquipment; decorations: CustomizationId[] }[] = [];
  for (const model of models) {
    const defaults = getEquipmentDefaults(model.id);
    const decorations = getEquipmentOptions(model.id).customizations.filter(option => option.id !== `none`);
    configurations.push({ model: model.id, skin: model.skin, defaults, decorations: decorations.map(option => option.id) });
    const views: { file: string; equipment: ModelEquipment; width: number; height: number; view: readonly [number, number, number]; skin?: SkinId; viewerTheme?: `light` | `dark` }[] = [
      { file: `images/${model.file}-studio.png`, equipment: defaults, width: 1800, height: 760, view: [.07, .10, 1] },
      { file: `proof/${model.file}-default-oblique.png`, equipment: defaults, width: 1500, height: 850, view: [.55, .34, 1] },
      { file: `proof/${model.file}-viewer-light.png`, equipment: defaults, width: 1500, height: 850, view: [.55, .34, 1], viewerTheme: `light` },
      { file: `proof/${model.file}-viewer-dark.png`, equipment: defaults, width: 1500, height: 850, view: [.55, .34, 1], viewerTheme: `dark` },
      { file: `proof/${model.file}-${model.id === `greatsword` ? `tiger-guard` : `arctic-scabbard`}.png`, equipment: { ...defaults, customization: model.id === `greatsword` ? `ornate-guard` : `scabbard` }, skin: model.id === `greatsword` ? `tiger` : `arctic`, width: 1500, height: 850, view: [.48, .29, 1] },
      ...decorations.map(option => ({ file: `proof/${model.file}-${option.illustration}-oblique.png`, equipment: { ...defaults, customization: option.id }, width: 1500, height: 850, view: [.48, .29, 1] as const })),
    ];
    for (const item of views) {
      if (status) status.textContent = `Rendering ${item.file}`;
      try {
        const result = render(createWeaponModel(model.id, item.skin ?? model.skin, item.equipment), item.file, item.width, item.height, item.view, 1.13, item.viewerTheme);
        results.push(result);
        addPreview(result);
      } catch (error) { failures.push({ file: item.file, reason: String(error) }); }
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
    for (const option of decorations) {
      const file = `attachments/${model.id}-${option.illustration}.png`;
      if (status) status.textContent = `Rendering ${model.id} ${option.label}`;
      try {
        const result = render(createPartModel(model.id, model.skin, { slot: `customization`, id: option.id }), file, 400, 280, [.65, .30, 1.25], 1.19, undefined, 0);
        results.push(result);
        addPreview(result);
      } catch (error) { failures.push({ file, reason: String(error) }); }
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
  }
  output.value = JSON.stringify({ configurations, results, failures });
  output.dataset.ready = `true`;
  if (status) status.textContent = `${results.length} Image(s) Rendered, ${failures.length} Failed`;
  button.disabled = false;
});
if (status) status.textContent = `Studio Ready`;
