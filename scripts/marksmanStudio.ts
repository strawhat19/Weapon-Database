import * as THREE from 'three';
import { SSAOPass } from 'three/addons/postprocessing/SSAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import type { ModelEquipment, EquipmentIllustration } from '../src/types/types';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createPartModel, createWeaponModel } from '../src/components/WeaponModel/buildWeapon';
import { getGunsmithSlots, getEquipmentDefaults } from '../src/shared/catalog/equipment';

const model = `marksman`;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.domElement.id = `marksman-studio-canvas`;
document.getElementById(`marksman-studio-preview`)?.append(renderer.domElement);
const environmentScene = new RoomEnvironment();
const environmentGenerator = new THREE.PMREMGenerator(renderer);
const environment = environmentGenerator.fromScene(environmentScene, .04);
scene.environment = environment.texture;
scene.environmentIntensity = .8;
environmentScene.dispose();
environmentGenerator.dispose();
const key = new THREE.DirectionalLight(0xf2f2ed, 1.9);
const fill = new THREE.DirectionalLight(0xcbdce9, 1.0);
const rim = new THREE.DirectionalLight(0xf3f0de, 2.2);
key.position.set(-4, 8, 9);
fill.position.set(6, 3, 5);
rim.position.set(1, 5, -7);
const hemisphere = new THREE.HemisphereLight(0xe5ecf0, 0x303934, .65);
scene.add(key, fill, rim, hemisphere);
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .01, 1000);
const renderTarget = new THREE.WebGLRenderTarget(1800, 720, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, renderTarget);
const ambientOcclusion = new SSAOPass(scene, camera, 1800, 720, 64);
ambientOcclusion.kernelRadius = .11;
ambientOcclusion.minDistance = .00006;
ambientOcclusion.maxDistance = .018;
ambientOcclusion.ssaoMaterial.defines[`PERSPECTIVE_CAMERA`] = 0;
composer.addPass(new RenderPass(scene, camera));
composer.addPass(ambientOcclusion);
composer.addPass(new OutputPass());
const status = document.getElementById(`marksman-studio-status`);
const output = document.getElementById(`marksman-studio-output`) as HTMLTextAreaElement;
const button = document.getElementById(`marksman-studio-generate`) as HTMLButtonElement;
type Presentation = ReturnType<typeof createWeaponModel>;
type Result = { file: string; data: string; width: number; height: number; triangles: number; meshes: number; bounds: number[]; camera: number[]; lighting: string };
const render = (presentation: Presentation, file: string, width: number, height: number, view: readonly [number, number, number], margin = 1.13, viewerTheme?: `light` | `dark`): Result => {
  const viewerLighting = Boolean(viewerTheme);
  key.color.setHex(viewerLighting ? 0xf5f4ea : 0xf2f2ed);
  fill.color.setHex(viewerLighting ? 0xb8cbd2 : 0xcbdce9);
  rim.color.setHex(viewerLighting ? 0xe0ead6 : 0xf3f0de);
  hemisphere.color.setHex(viewerLighting ? 0xcbd5de : 0xe5ecf0);
  hemisphere.groundColor.setHex(viewerLighting ? 0x263027 : 0x303934);
  key.intensity = viewerLighting ? 3.2 : 1.9;
  fill.intensity = viewerLighting ? 2 : 1;
  rim.intensity = viewerLighting ? 2.8 : 2.2;
  hemisphere.intensity = viewerLighting ? 1 : .65;
  key.position.set(-4, viewerLighting ? 7 : 8, viewerLighting ? 8 : 9);
  fill.position.set(viewerLighting ? 5 : 6, viewerLighting ? 2 : 3, viewerLighting ? 4 : 5);
  rim.position.set(viewerLighting ? 0 : 1, 5, viewerLighting ? -6 : -7);
  renderer.toneMappingExposure = viewerTheme === `dark` ? 1.2 : viewerTheme === `light` ? 1.05 : 1;
  scene.environmentIntensity = viewerTheme === `dark` ? 1 : viewerTheme === `light` ? .85 : .8;
  if (viewerLighting) presentation.object.rotation.z = THREE.MathUtils.degToRad(3);
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
  image.className = `marksman-studio-result`;
  image.id = `marksman-studio-result-${result.file.replace(/\W/g, `-`)}`;
  document.getElementById(`marksman-studio-results`)?.append(image);
};
const arrangeSightPair = (presentation: Presentation) => {
  const bounds = new THREE.Box3().setFromObject(presentation.object);
  const halfSpan = bounds.getSize(new THREE.Vector3()).x / 2;
  const displacement = Math.max(0, halfSpan - .21);
  presentation.object.traverse(object => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;
    const positions = mesh.geometry.getAttribute(`position`);
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      positions.setX(index, x + (x < 0 ? displacement : -displacement));
    }
    positions.needsUpdate = true;
    mesh.geometry.computeBoundingBox();
    mesh.geometry.computeBoundingSphere();
  });
};
button.disabled = false;
button.addEventListener(`click`, async () => {
  button.disabled = true;
  document.getElementById(`marksman-studio-results`)?.replaceChildren();
  const results: Result[] = [];
  const failures: { file: string; reason: string }[] = [];
  const defaults = getEquipmentDefaults(model);
  const equipped: ModelEquipment = { ...defaults, rail: `light`, stock: `cheek-rest`, magazine: `extended`, muzzle: `suppressor` };
  const views: { file: string; equipment: ModelEquipment; width: number; height: number; view: readonly [number, number, number]; viewerTheme?: `light` | `dark` }[] = [
    { file: `images/vigil-mr14-studio.png`, equipment: defaults, width: 1800, height: 720, view: [.06, .085, 1] },
    { file: `proof/vigil-mr14-default-oblique.png`, equipment: defaults, width: 1500, height: 800, view: [.68, .36, 1] },
    { file: `proof/vigil-mr14-equipped-oblique.png`, equipment: equipped, width: 1500, height: 800, view: [.58, .33, 1] },
    { file: `proof/vigil-mr14-viewer-light-oblique.png`, equipment: equipped, width: 1500, height: 800, view: [.58, .33, 1], viewerTheme: `light` },
    { file: `proof/vigil-mr14-viewer-dark-oblique.png`, equipment: equipped, width: 1500, height: 800, view: [.58, .33, 1], viewerTheme: `dark` },
  ];
  for (const item of views) {
    if (status) status.textContent = `Rendering ${item.file}`;
    try {
      const result = render(createWeaponModel(model, `graphite`, item.equipment), item.file, item.width, item.height, item.view, 1.13, item.viewerTheme);
      results.push(result);
      addPreview(result);
    } catch (error) { failures.push({ file: item.file, reason: String(error) }); }
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  const seen = new Set<EquipmentIllustration>();
  for (const slot of getGunsmithSlots(model, defaults)) for (const option of slot.options) {
    if (option.illustration === `none` || seen.has(option.illustration)) continue;
    seen.add(option.illustration);
    const file = `attachments/${model}-${option.illustration}.png`;
    if (status) status.textContent = `Rendering ${option.label}`;
    try {
      const part = createPartModel(model, `graphite`, { slot: slot.id, id: option.id });
      if (option.illustration === `iron`) arrangeSightPair(part);
      const view: readonly [number, number, number] = [option.illustration === `bipod` ? -.75 : .75, .42, 1.25];
      const result = render(part, file, 400, 280, view, 1.21);
      results.push(result);
      addPreview(result);
    } catch (error) { failures.push({ file, reason: String(error) }); }
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
  }
  output.value = JSON.stringify({ model, defaults, equipped, results, failures });
  output.dataset.ready = `true`;
  if (status) status.textContent = `${results.length} Image(s) Rendered, ${failures.length} Failed`;
  button.disabled = false;
});
if (status) status.textContent = `Studio Ready`;
