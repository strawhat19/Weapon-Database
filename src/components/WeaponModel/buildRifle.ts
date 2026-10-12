import * as THREE from 'three';
import { createWeaponFinish } from './weaponFinishes';
import type { SkinId, OpticId } from '../../types/types';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type ProfilePoint = readonly [number, number];
type RifleMaterial = THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial;

export const createRifleModel = (skin: SkinId, optic: OpticId = `precision`) => {
  const object = new THREE.Group();
  const assembly = new THREE.Group();
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<RifleMaterial>();
  const geometryCache = new Map<string, THREE.BufferGeometry>();
  object.name = `ARX-27 Presentation Model`;
  assembly.name = `Rifle Assembly`;
  object.add(assembly);

  const material = (color: string, metalness: number, roughness: number) => {
    const result = new THREE.MeshStandardMaterial({ color, metalness, roughness });
    materials.add(result);
    return result;
  };
  const paint = material(`#375540`, 0.42, 0.42);
  const paintInset = material(`#2c4433`, 0.24, 0.67);
  const rubber = material(`#151817`, 0.08, 0.88);
  const recess = material(`#0b100f`, 0.12, 0.73);
  const anodized = material(`#232a28`, 0.72, 0.36);
  const scopeMetal = material(`#1d2321`, 0.7, 0.3);
  const steel = material(`#65716f`, 0.86, 0.3);
  const edgeSteel = material(`#424c49`, 0.82, 0.4);
  const lens = new THREE.MeshPhysicalMaterial({
    color: `#19494d`,
    metalness: 0.5,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.07,
  });
  materials.add(lens);

  const ownGeometry = <T extends THREE.BufferGeometry>(geometry: T) => {
    geometries.add(geometry);
    return geometry;
  };
  const cachedGeometry = (key: string, create: () => THREE.BufferGeometry) => {
    let geometry = geometryCache.get(key);
    if (!geometry) {
      geometry = ownGeometry(create());
      geometryCache.set(key, geometry);
    }
    return geometry;
  };
  const mesh = (geometry: THREE.BufferGeometry, finish: RifleMaterial, name: string) => {
    const result = new THREE.Mesh(geometry, finish);
    result.name = name;
    assembly.add(result);
    return result;
  };
  const box = (x: number, y: number, z: number, width: number, height: number, depth: number, finish: RifleMaterial, name: string) => {
    const geometry = cachedGeometry(`box:${width}:${height}:${depth}`, () => new THREE.BoxGeometry(width, height, depth));
    const result = mesh(geometry, finish, name);
    result.position.set(x, y, z);
    return result;
  };
  const cylinder = (x: number, y: number, z: number, radius: number, length: number, finish: RifleMaterial, axis: `x` | `y` | `z`, name: string, radiusEnd = radius) => {
    const geometry = cachedGeometry(`cylinder:${radius}:${radiusEnd}:${length}`, () => new THREE.CylinderGeometry(radiusEnd, radius, length, 40));
    const result = mesh(geometry, finish, name);
    result.position.set(x, y, z);
    if (axis === `x`) result.rotation.z = -Math.PI / 2;
    if (axis === `z`) result.rotation.x = Math.PI / 2;
    return result;
  };
  const polygon = (points: ProfilePoint[]) => {
    const shape = new THREE.Shape();
    shape.moveTo(points[0][0], points[0][1]);
    points.slice(1).forEach(([x, y]) => shape.lineTo(x, y));
    shape.closePath();
    return shape;
  };
  const roundedPath = (x: number, y: number, width: number, height: number, radius: number) => {
    const path = new THREE.Path();
    const right = x + width;
    const top = y + height;
    const r = Math.min(radius, width / 2, height / 2);
    path.moveTo(x + r, y);
    path.lineTo(right - r, y);
    path.quadraticCurveTo(right, y, right, y + r);
    path.lineTo(right, top - r);
    path.quadraticCurveTo(right, top, right - r, top);
    path.lineTo(x + r, top);
    path.quadraticCurveTo(x, top, x, top - r);
    path.lineTo(x, y + r);
    path.quadraticCurveTo(x, y, x + r, y);
    path.closePath();
    return path;
  };
  const roundedShape = (x: number, y: number, width: number, height: number, radius: number) => {
    const shape = new THREE.Shape();
    shape.curves = roundedPath(x, y, width, height, radius).curves;
    return shape;
  };
  const profile = (shape: THREE.Shape, depth: number, z: number, finish: RifleMaterial, name: string, bevel = 0.025) => {
    const geometry = ownGeometry(new THREE.ExtrudeGeometry(shape, {
      depth,
      steps: 1,
      curveSegments: 12,
      bevelSegments: 3,
      bevelEnabled: bevel > 0,
      bevelSize: bevel,
      bevelThickness: bevel,
    }));
    const result = mesh(geometry, finish, name);
    result.position.z = z;
    return result;
  };
  const ring = (x: number, y: number, z: number, radius: number, thickness: number, finish: RifleMaterial, axis: `x` | `y` | `z`, name: string) => {
    const geometry = cachedGeometry(`ring:${radius}:${thickness}`, () => new THREE.TorusGeometry(radius, thickness, 10, 48));
    const result = mesh(geometry, finish, name);
    result.position.set(x, y, z);
    if (axis === `x`) result.rotation.y = Math.PI / 2;
    if (axis === `y`) result.rotation.x = Math.PI / 2;
    return result;
  };
  const tube = (points: THREE.Vector3[], radius: number, finish: RifleMaterial, name: string) => {
    const curve = new THREE.CatmullRomCurve3(points);
    return mesh(ownGeometry(new THREE.TubeGeometry(curve, 24, radius, 8, false)), finish, name);
  };
  const bolt = (x: number, y: number, z: number, radius = 0.047) => {
    cylinder(x, y, z, radius, 0.018, edgeSteel, `z`, `Recessed Fastener`);
    const geometry = cachedGeometry(`hex:${radius}`, () => new THREE.CylinderGeometry(radius * 0.47, radius * 0.47, 0.022, 6));
    const socket = mesh(geometry, recess, `Fastener Socket`);
    socket.rotation.x = Math.PI / 2;
    socket.position.set(x, y, z + Math.sign(z || 1) * 0.006);
  };

  cylinder(-2.81, 0.16, 0, 0.166, 1.3, anodized, `x`, `Stock Buffer Tube`);
  cylinder(-2.71, 0.16, 0, 0.22, 0.085, scopeMetal, `x`, `Receiver Collar`);
  ring(-2.71, 0.16, 0, 0.219, 0.014, edgeSteel, `x`, `Receiver Collar Edge`);
  const stock = polygon([
    [-4.84, 0.46], [-3.12, 0.46], [-2.96, 0.27], [-3.03, -0.27], [-3.18, -0.45],
    [-3.74, -0.9], [-4.5, -1.16], [-4.83, -1.16],
  ]);
  stock.holes.push(polygon([[-4.53, -0.17], [-3.5, -0.17], [-4.44, -0.86]]));
  stock.holes.push(roundedPath(-3.59, -0.22, 0.41, 0.15, 0.07));
  profile(stock, 0.47, -0.235, paint, `Skeleton Shoulder Stock`, 0.038);
  profile(polygon([[-4.88, 0.51], [-4.77, 0.49], [-4.73, -1.18], [-4.88, -1.22], [-5.0, -1.14], [-5.0, 0.36]]), 0.56, -0.28, rubber, `Rubber Shoulder Pad`, 0.055);
  profile(polygon([[-4.69, 0.45], [-3.29, 0.45], [-3.17, 0.33], [-3.21, 0.15], [-4.65, 0.15]]), 0.52, -0.26, paint, `Raised Cheek Rest`, 0.032);
  for (let index = 0; index < 14; index += 1) {
    const y = 0.33 - index * 0.102;
    for (const side of [-1, 1]) {
      const tread = box(-4.916, y, side * 0.295, 0.105, 0.022, 0.019, recess, `Shoulder Pad Tread`);
      tread.rotation.z = index % 2 ? 0.32 : -0.32;
    }
  }
  for (const side of [-1, 1]) {
    const z = side * 0.262;
    ring(-4.53, -0.04, z, 0.083, 0.028, anodized, `z`, `Stock Sling Socket`);
    ring(-4.53, -0.91, z, 0.066, 0.024, anodized, `z`, `Lower Stock Socket`);
    ring(-3.19, -0.21, z, 0.072, 0.024, anodized, `z`, `Front Stock Socket`);
    profile(polygon([[-4.35, -0.31], [-3.61, -0.31], [-3.83, -0.49], [-4.34, -0.57]]), 0.028, z - 0.014, paintInset, `Stock Adjustment Paddle`, 0.018);
    box(-4.05, -0.32, z + side * 0.025, 0.33, 0.06, 0.045, anodized, `Stock Lock Lever`);
    bolt(-4.29, -0.38, z + side * 0.04);
    bolt(-3.86, -0.33, z + side * 0.04, 0.04);
  }

  profile(polygon([
    [-2.5, 0.42], [-0.29, 0.42], [-0.16, 0.21], [-0.17, -0.56], [-0.91, -0.76],
    [-1.08, -0.67], [-1.14, -0.46], [-1.95, -0.46], [-2.21, -0.33], [-2.53, -0.31],
  ]), 0.52, -0.26, anodized, `Angular Lower Receiver`, 0.035);
  profile(polygon([[-2.51, 0.4], [-2.39, 0.55], [-0.29, 0.55], [-0.12, 0.32], [-0.16, 0.01], [-2.48, 0.04]]), 0.54, -0.27, scopeMetal, `Upper Receiver`, 0.028);
  profile(polygon([[-1.03, -0.3], [-0.18, -0.23], [-0.19, -0.73], [-0.99, -0.89]]), 0.565, -0.2825, anodized, `Beveled Magazine Well`, 0.024);
  for (const side of [-1, 1]) {
    const z = side * 0.303;
    const plate = polygon([[-2.37, -0.03], [-1.23, -0.03], [-1.17, -0.37], [-1.95, -0.39], [-2.37, -0.22]]);
    profile(plate, 0.014, z - 0.007, anodized, `Receiver Side Panel`, 0.009);
    bolt(-2.29, -0.2, z + side * 0.011, 0.057);
    bolt(-1.96, -0.29, z + side * 0.011, 0.049);
    bolt(-1.4, -0.25, z + side * 0.011, 0.036);
    bolt(-0.28, -0.09, z + side * 0.012, 0.046);
    profile(polygon([[-0.99, -0.66], [-0.25, -0.51], [-0.25, -0.56], [-0.97, -0.71]]), 0.012, z - 0.006, edgeSteel, `Magazine Well Edge` , 0.003);
  }
  profile(roundedShape(-1.31, 0.01, 0.95, 0.37, 0.07), 0.022, 0.301, recess, `Ejection Port Recess`, 0.017);
  profile(polygon([[-1.23, 0.31], [-0.72, 0.31], [-0.67, 0.21], [-0.39, 0.2], [-0.4, 0.07], [-1.23, 0.07]]), 0.008, 0.33, edgeSteel, `Inset Bolt Face`, 0.009);
  profile(polygon([[-1.29, 0.02], [-0.41, 0.02], [-0.44, -0.15], [-1.24, -0.15]]), 0.018, 0.33, anodized, `Port Cover`, 0.015);
  cylinder(-0.85, 0.015, 0.365, 0.025, 0.95, steel, `x`, `Port Cover Hinge`);
  box(-0.85, -0.03, 0.362, 0.06, 0.16, 0.03, scopeMetal, `Port Cover Latch`);
  cylinder(-2.24, 0.21, 0.331, 0.075, 0.42, scopeMetal, `x`, `Receiver Forward Detail`, 0.048);
  for (const side of [-1, 1]) {
    cylinder(-1.94, -0.16, side * 0.34, 0.071, 0.06, scopeMetal, `z`, `Selector Base`);
    const selector = box(-1.86, -0.13, side * 0.377, 0.19, 0.046, 0.027, edgeSteel, `Selector Lever`);
    selector.rotation.z = 0.33;
    box(-1.22, -0.36, side * 0.324, 0.075, 0.12, 0.048, scopeMetal, `Magazine Release`);
  }
  const triggerGuard = roundedShape(-1.96, -0.99, 0.96, 0.59, 0.2);
  triggerGuard.holes.push(roundedPath(-1.865, -0.884, 0.75, 0.395, 0.13));
  profile(triggerGuard, 0.3, -0.15, anodized, `Open Trigger Guard`, 0.018);
  tube([new THREE.Vector3(-1.68, -0.48, 0), new THREE.Vector3(-1.72, -0.67, 0), new THREE.Vector3(-1.61, -0.8, 0)], 0.037, scopeMetal, `Curved Trigger`);
  profile(polygon([[-2.3, -0.34], [-1.98, -0.45], [-1.98, -0.76], [-2.44, -1.82], [-2.94, -1.64], [-2.53, -0.73], [-2.54, -0.46]]), 0.42, -0.21, paint, `Angled Pistol Grip`, 0.052);
  for (const side of [-1, 1]) {
    const z = side * 0.245;
    profile(polygon([[-2.46, -0.77], [-2.15, -0.87], [-2.51, -1.64], [-2.8, -1.55]]), 0.016, z - 0.008, paintInset, `Grip Texture Panel`, 0.012);
    for (let row = 0; row < 19; row += 1) {
      const t = row / 18;
      const x = -2.42 - t * 0.33;
      const y = -0.84 - t * 0.64;
      const groove = box(x + 0.09, y - 0.03, z + side * 0.019, 0.25, 0.012, 0.008, edgeSteel, `Grip Fine Rib`);
      groove.rotation.z = -0.32;
    }
    profile(polygon([[-2.83, -1.64], [-2.52, -1.74], [-2.48, -1.81], [-2.86, -1.68]]), 0.028, z - 0.014, rubber, `Grip Heel Insert`, 0.009);
  }

  const magazine = new THREE.Shape();
  magazine.moveTo(-1.0, -0.72);
  magazine.lineTo(-0.22, -0.58);
  magazine.quadraticCurveTo(-0.22, -1.3, 0.075, -2.03);
  magazine.quadraticCurveTo(-0.16, -2.16, -0.65, -2.16);
  magazine.quadraticCurveTo(-0.92, -1.44, -1.0, -0.72);
  magazine.closePath();
  profile(magazine, 0.4, -0.2, rubber, `Curved Ribbed Magazine`, 0.045);
  for (const side of [-1, 1]) {
    const z = side * 0.249;
    for (let column = 0; column < 3; column += 1) {
      const offset = -0.92 + column * 0.255;
      tube([
        new THREE.Vector3(offset, -0.89, z),
        new THREE.Vector3(offset + 0.035, -1.26, z),
        new THREE.Vector3(offset + 0.105, -1.62, z),
        new THREE.Vector3(offset + 0.245, -2.05, z),
      ], 0.016, edgeSteel, `Magazine Long Rib`);
    }
    for (let row = 0; row < 4; row += 1) {
      const t = (row + 1) / 5;
      const x = -0.97 + 0.245 * t * t;
      const y = -0.77 - 1.3 * t;
      tube([
        new THREE.Vector3(x, y - 0.045, z),
        new THREE.Vector3(x + 0.32, y - 0.025, z + side * 0.009),
        new THREE.Vector3(x + 0.67, y + 0.045, z),
      ], 0.016, edgeSteel, `Magazine Cross Rib`);
    }
    profile(polygon([[-0.72, -2.04], [0.055, -1.94], [0.105, -2.075], [-0.674, -2.197]]), 0.034, z - 0.017, anodized, `Magazine Base Collar`, 0.017);
  }

  const handguardOutline: ProfilePoint[] = [[-0.17, 0.42], [3.57, 0.42], [3.66, 0.29], [3.63, -0.27], [3.47, -0.39], [0.25, -0.39], [0.08, -0.49], [-0.17, -0.34]];
  for (const side of [-1, 1]) {
    const sidePanel = polygon(handguardOutline);
    for (let index = 0; index < 9; index += 1) {
      const x = 0.12 + index * 0.386;
      sidePanel.holes.push(roundedPath(x, 0.212, 0.282, 0.105, 0.052));
      sidePanel.holes.push(roundedPath(x + 0.027, -0.259, 0.265, 0.093, 0.046));
      if (index < 3 || index > 6) sidePanel.holes.push(roundedPath(x + 0.022, -0.027, 0.26, 0.11, 0.05));
    }
    profile(sidePanel, 0.045, side * 0.317 - 0.0225, paint, `Ventilated Handguard Side`, 0.013);
    profile(polygon([[0.9, 0.105], [2.82, 0.105], [2.86, 0.015], [2.82, -0.107], [0.9, -0.107]]), 0.058, side * 0.377 - 0.029, rubber, `Handguard Grip Rail`, 0.018);
    for (let index = 0; index < 27; index += 1) box(0.973 + index * 0.067, 0, side * 0.42, 0.033, 0.155, 0.025, scopeMetal, `Side Rail Grip Rib`);
    bolt(1.23, 0.004, side * 0.437, 0.054);
    bolt(2.53, 0.004, side * 0.437, 0.054);
    bolt(0.018, 0.28, side * 0.352);
    bolt(0.12, -0.348, side * 0.352, 0.044);
    bolt(3.478, -0.309, side * 0.352, 0.039);
  }
  const topPanel = roundedShape(-0.12, -0.29, 3.72, 0.58, 0.09);
  const bottomPanel = roundedShape(-0.12, -0.27, 3.72, 0.54, 0.08);
  for (let index = 0; index < 9; index += 1) {
    topPanel.holes.push(roundedPath(0.08 + index * 0.392, -0.09, 0.25, 0.18, 0.04));
    bottomPanel.holes.push(roundedPath(0.08 + index * 0.392, -0.11, 0.25, 0.22, 0.05));
  }
  const topShell = profile(topPanel, 0.045, -0.0225, paint, `Ventilated Handguard Roof`, 0.011);
  topShell.rotation.x = Math.PI / 2;
  topShell.position.set(0, 0.414, 0);
  const lowerShell = profile(bottomPanel, 0.045, -0.0225, paint, `Ventilated Handguard Floor`, 0.011);
  lowerShell.rotation.x = Math.PI / 2;
  lowerShell.position.set(0, -0.33, 0);
  for (const x of [-0.13, 3.585]) {
    const frame = polygon([[-0.31, -0.33], [0.31, -0.33], [0.37, -0.21], [0.37, 0.28], [0.29, 0.4], [-0.29, 0.4], [-0.37, 0.28], [-0.37, -0.21]]);
    frame.holes.push(polygon([[-0.23, -0.245], [0.23, -0.245], [0.28, -0.16], [0.28, 0.25], [0.23, 0.31], [-0.23, 0.31], [-0.28, 0.25], [-0.28, -0.16]]));
    const endFrame = profile(frame, 0.09, 0, paint, `Hollow Handguard End Frame`, 0.012);
    endFrame.rotation.y = Math.PI / 2;
    endFrame.position.set(x, 0, 0);
  }
  cylinder(2.26, 0.035, 0, 0.101, 5.0, scopeMetal, `x`, `Barrel`);
  cylinder(3.585, 0.035, 0, 0.14, 0.28, anodized, `x`, `Barrel Collar`);
  cylinder(4.45, 0.035, 0, 0.134, 0.11, anodized, `x`, `Muzzle Collar`);
  for (const x of [4.4, 4.47, 4.56]) ring(x, 0.035, 0, 0.13, 0.01, edgeSteel, `x`, `Barrel Collar Seam`);
  const muzzleRing = (x: number, length: number) => {
    const shape = new THREE.Shape();
    shape.absarc(0, 0, 0.184, 0, Math.PI * 2, false);
    const opening = new THREE.Path();
    opening.absarc(0, 0, 0.105, 0, Math.PI * 2, true);
    shape.holes.push(opening);
    const collar = profile(shape, length, 0, scopeMetal, `Hollow Muzzle Rim`, 0.011);
    collar.rotation.y = Math.PI / 2;
    collar.position.set(x, 0.035, 0);
  };
  muzzleRing(4.575, 0.065);
  muzzleRing(4.975, 0.075);
  for (let index = 0; index < 4; index += 1) {
    const start = index * Math.PI / 2 + Math.PI / 8;
    const end = start + Math.PI / 4;
    const section = new THREE.Shape();
    section.moveTo(Math.cos(start) * 0.184, Math.sin(start) * 0.184);
    section.absarc(0, 0, 0.184, start, end, false);
    section.lineTo(Math.cos(end) * 0.105, Math.sin(end) * 0.105);
    section.absarc(0, 0, 0.105, end, start, true);
    section.closePath();
    const bridge = profile(section, 0.37, 0, scopeMetal, `Muzzle Slot Bridge`, 0.007);
    bridge.rotation.y = Math.PI / 2;
    bridge.position.set(4.627, 0.035, 0);
  }

  box(0.535, 0.481, 0, 6.14, 0.07, 0.27, scopeMetal, `Continuous Top Rail`);
  for (let index = 0; index < 51; index += 1) {
    const x = -2.46 + index * 0.12;
    profile(polygon([[x - 0.039, 0.502], [x + 0.039, 0.502], [x + 0.047, 0.54], [x + 0.035, 0.574], [x - 0.035, 0.574], [x - 0.047, 0.54]]), 0.38, -0.19, anodized, `Top Rail Tooth`, 0.007);
  }
  for (const x of [-2.15, 3.23]) {
    profile(polygon([[x - 0.2, 0.565], [x + 0.19, 0.565], [x + 0.13, 0.657], [x - 0.13, 0.657]]), 0.31, -0.155, scopeMetal, `Folded Sight Housing`, 0.023);
    cylinder(x, 0.599, 0, 0.073, 0.38, anodized, `z`, `Sight Hinge`);
    bolt(x, 0.599, 0.213, 0.035);
    bolt(x, 0.599, -0.213, 0.035);
  }

  if (optic === `precision`) {
    cylinder(-0.33, 1.125, 0, 0.165, 2.56, scopeMetal, `x`, `Scope Main Tube`);
    cylinder(-1.488, 1.125, 0, 0.268, 0.68, scopeMetal, `x`, `Scope Objective Housing`, 0.25);
    cylinder(-1.06, 1.125, 0, 0.25, 0.2, scopeMetal, `x`, `Scope Objective Taper`, 0.165);
    cylinder(0.762, 1.125, 0, 0.165, 0.48, scopeMetal, `x`, `Scope Ocular Taper`, 0.217);
    cylinder(1.067, 1.125, 0, 0.217, 0.19, scopeMetal, `x`, `Scope Ocular Rim`);
    for (const [x, radius] of [[-1.807, 0.265], [-1.72, 0.262], [-1.157, 0.248], [1.143, 0.216], [1.017, 0.209]]) {
      ring(x, 1.125, 0, radius, 0.015, edgeSteel, `x`, `Scope Housing Edge`);
    }
    for (let index = 0; index < 28; index += 1) {
      const angle = index * Math.PI * 2 / 28;
      for (const x of [-1.762, -1.141]) {
        const ridge = box(x, 1.125 + Math.cos(angle) * 0.267, Math.sin(angle) * 0.267, 0.068, 0.018, 0.028, edgeSteel, `Scope Focus Ring Knurl`);
        ridge.rotation.x = angle;
      }
    }
    for (const [x, radius] of [[-1.834, 0.22], [1.167, 0.177]]) {
      const geometry = cachedGeometry(`lens:${radius}`, () => new THREE.CircleGeometry(radius, 48));
      const glass = mesh(geometry, lens, `Recessed Scope Lens`);
      glass.position.set(x, 1.125, 0);
      glass.rotation.y = x < 0 ? -Math.PI / 2 : Math.PI / 2;
      ring(x, 1.125, 0, radius + 0.008, 0.009, anodized, `x`, `Scope Lens Bezel`);
    }
    for (const x of [-0.87, 0.3]) {
      ring(x, 1.125, 0, 0.194, 0.043, anodized, `x`, `Scope Mount Ring`);
      profile(polygon([[x - 0.14, 0.562], [x + 0.14, 0.562], [x + 0.105, 1.002], [x - 0.105, 1.002]]), 0.36, -0.18, scopeMetal, `Scope Mount Riser`, 0.019);
      box(x, 0.594, 0, 0.34, 0.075, 0.44, anodized, `Scope Clamp Base`);
      for (const side of [-1, 1]) {
        bolt(x - 0.085, 0.601, side * 0.241, 0.044);
        bolt(x + 0.085, 0.601, side * 0.241, 0.044);
        bolt(x, 0.875, side * 0.208, 0.037);
      }
    }
    cylinder(-0.356, 1.353, 0, 0.184, 0.225, scopeMetal, `y`, `Scope Elevation Turret`);
    cylinder(-0.356, 1.494, 0, 0.188, 0.092, anodized, `y`, `Scope Turret Dial`);
    ring(-0.356, 1.495, 0, 0.184, 0.011, edgeSteel, `y`, `Turret Dial Edge`);
    cylinder(-0.356, 1.125, 0.19, 0.184, 0.175, scopeMetal, `z`, `Scope Side Turret`);
    cylinder(-0.356, 1.125, 0.295, 0.166, 0.045, edgeSteel, `z`, `Scope Side Dial Face`);
    ring(-0.356, 1.125, 0.309, 0.163, 0.012, steel, `z`, `Scope Side Dial Rim`);
    for (let index = 0; index < 24; index += 1) {
      const angle = index * Math.PI * 2 / 24;
      const ridge = box(-0.356 + Math.cos(angle) * 0.19, 1.494, Math.sin(angle) * 0.19, 0.018, 0.065, 0.019, edgeSteel, `Turret Dial Knurl`);
      ridge.rotation.y = -angle;
    }
  }
  for (const side of [-1, 1]) {
    ring(2.7, -0.411, side * 0.1, 0.073, 0.026, anodized, `z`, `Forward Sling Eyelet`);
    box(2.7, -0.347, side * 0.1, 0.13, 0.07, 0.048, scopeMetal, `Sling Eyelet Mount`);
  }

  const framingPoints: THREE.Vector3[] = [];
  const batches = new Map<RifleMaterial, THREE.BufferGeometry[]>();
  assembly.children.forEach(child => {
    const part = child as THREE.Mesh<THREE.BufferGeometry, RifleMaterial>;
    const geometry = part.geometry.index ? part.geometry.toNonIndexed() : part.geometry.clone();
    part.updateMatrix();
    part.geometry.computeBoundingBox();
    const bounds = part.geometry.boundingBox;
    if (bounds) {
      for (const x of [bounds.min.x, bounds.max.x]) {
        for (const y of [bounds.min.y, bounds.max.y]) {
          for (const z of [bounds.min.z, bounds.max.z]) framingPoints.push(new THREE.Vector3(x, y, z).applyMatrix4(part.matrix));
        }
      }
    }
    geometry.applyMatrix4(part.matrix);
    const batch = batches.get(part.material) ?? [];
    batch.push(geometry);
    batches.set(part.material, batch);
  });
  const mergedParts: THREE.Mesh[] = [];
  batches.forEach((batch, finish) => {
    const geometry = mergeGeometries(batch);
    if (geometry) {
      ownGeometry(geometry);
      const part = new THREE.Mesh(geometry, finish);
      part.name = `Rifle Material Batch`;
      mergedParts.push(part);
    }
    batch.forEach(part => part.dispose());
  });
  if (mergedParts.length === batches.size) {
    const mergedGeometries = new Set(mergedParts.map(part => part.geometry));
    geometries.forEach(geometry => {
      if (!mergedGeometries.has(geometry)) {
        geometry.dispose();
        geometries.delete(geometry);
      }
    });
    assembly.clear();
    assembly.add(...mergedParts);
    geometryCache.clear();
  }
  const center = new THREE.Box3().setFromObject(assembly).getCenter(new THREE.Vector3());
  assembly.position.copy(center).multiplyScalar(-1);
  framingPoints.forEach(point => point.sub(center));
  const finish = createWeaponFinish([paint, paintInset], object);
  const setSkin = finish.setSkin;
  const dispose = () => {
    finish.dispose();
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(finish => finish.dispose());
    geometryCache.clear();
    geometries.clear();
    materials.clear();
    framingPoints.length = 0;
    object.clear();
  };
  try { setSkin(skin); }
  catch (error) { dispose(); throw error; }
  return { object, setSkin, dispose, framingPoints, origin: center.clone() };
};
