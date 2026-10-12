import * as THREE from 'three';
import { createPartModel } from '../src/components/WeaponModel/buildWeapon';
import type { EquipmentIllustration, WeaponModelId } from '../src/types/types';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { getGunsmithSlots, getEquipmentDefaults } from '../src/shared/catalog/equipment';

const models: WeaponModelId[] = [`rifle`, `smg`, `shotgun`, `precision`, `marksman`, `pistol`, `longsword`, `katana`, `saber`, `greatsword`, `falchion`, `quadcopter`, `fixedwing`, `recurvebow`, `compoundbow`];
const width = 400;
const height = 280;
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
renderer.setSize(width, height);
renderer.setPixelRatio(1);
renderer.setClearColor(0x000000, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.24;
renderer.domElement.id = `attachment-thumbnail-canvas`;
document.getElementById(`attachment-thumbnail-preview`)?.append(renderer.domElement);
const environmentScene = new RoomEnvironment();
const environmentGenerator = new THREE.PMREMGenerator(renderer);
const environment = environmentGenerator.fromScene(environmentScene, .04);
scene.environment = environment.texture;
environmentScene.dispose();
environmentGenerator.dispose();
const key = new THREE.DirectionalLight(0xf5f4ea, 4);
const fill = new THREE.DirectionalLight(0xc6d9e4, 2.8);
const rim = new THREE.DirectionalLight(0xe8f0e1, 3.4);
key.position.set(-4, 7, 8);
fill.position.set(5, 2, 4);
rim.position.set(0, 5, -6);
scene.add(key, fill, rim, new THREE.HemisphereLight(0xdce6ee, 0x303c36, 1.5));
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .01, 1000);
const status = document.getElementById(`attachment-thumbnail-status`);
const output = document.getElementById(`attachment-thumbnail-output`) as HTMLTextAreaElement;
const button = document.getElementById(`attachment-thumbnail-generate`) as HTMLButtonElement;
const renderPart = (model: WeaponModelId, slot: Parameters<typeof createPartModel>[2][`slot`], id: string, illustration: EquipmentIllustration) => {
  const part = createPartModel(model, `graphite`, { slot, id });
  try {
    const bounds = new THREE.Box3().setFromObject(part.object);
    const center = bounds.getCenter(new THREE.Vector3());
    const span = bounds.getSize(new THREE.Vector3()).length();
    part.object.position.sub(center);
    scene.add(part.object);
    camera.position.set(span * .75, span * .42, span * 1.25);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    const projected = part.framingPoints.map(point => point.clone().sub(center).applyMatrix4(camera.matrixWorldInverse));
    const horizontal = Math.max(...projected.map(point => Math.abs(point.x)));
    const vertical = Math.max(...projected.map(point => Math.abs(point.y)));
    const halfWidth = Math.max(horizontal, vertical * width / height) * 1.21;
    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfWidth * height / width;
    camera.bottom = -camera.top;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    return { file: `${model}-${illustration}.png`, data: renderer.domElement.toDataURL(`image/png`) };
  } finally {
    scene.remove(part.object);
    part.dispose();
  }
};
button.disabled = false;
button.addEventListener(`click`, async () => {
  button.disabled = true;
  const results: { file: string; data: string }[] = [];
  const failures: { model: string; slot: string; part: string; reason: string }[] = [];
  for (const model of models) {
    const seen = new Set<EquipmentIllustration>();
    for (const slot of getGunsmithSlots(model, getEquipmentDefaults(model))) for (const option of slot.options) {
      if (option.illustration === `none` || seen.has(option.illustration)) continue;
      seen.add(option.illustration);
      if (status) status.textContent = `Rendering ${model} ${option.label}`;
      try { results.push(renderPart(model, slot.id, option.id, option.illustration)); }
      catch (error) { failures.push({ model, slot: slot.id, part: option.id, reason: String(error) }); }
      await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    }
  }
  output.value = JSON.stringify({ results, failures });
  output.dataset.ready = `true`;
  if (status) status.textContent = `${results.length} Thumbnail(s) Rendered, ${failures.length} Failed`;
  button.disabled = false;
});
if (status) status.textContent = `Studio Ready`;
