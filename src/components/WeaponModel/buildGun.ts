import * as THREE from 'three';
import { createRifleModel } from './buildRifle';
import { createWeaponFinish } from './weaponFinishes';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { GunModelId, SkinId, OpticId, AttachmentId } from '../../types/types';

type Point = readonly [number, number];

export const createGunModel = (model: GunModelId, skin: SkinId, optic: OpticId = model === `rifle` || model === `precision` ? `precision` : `standard`, attachment: AttachmentId = model === `precision` ? `bipod` : `none`): ReturnType<typeof createRifleModel> => {
  if (model === `rifle`) return createRifleModel(skin, optic);
  const object = new THREE.Group();
  object.name = `${model.toUpperCase()} Presentation Model`;
  const paint = new THREE.MeshStandardMaterial({ color: 0xaeb9aa, metalness: 0.35, roughness: 0.62 });
  const paintInset = new THREE.MeshStandardMaterial({ color: 0x75856d, metalness: 0.28, roughness: 0.7 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x232a30, metalness: 0.8, roughness: 0.38 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x151b20, metalness: 0.05, roughness: 0.94 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x79858c, metalness: 0.88, roughness: 0.32 });
  const lens = new THREE.MeshPhysicalMaterial({ color: 0x407e92, metalness: 0.4, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 });
  const materials = [paint, paintInset, metal, rubber, trim, lens];
  const finish = createWeaponFinish([paint, paintInset], object);
  const cache = new Map<string, THREE.BufferGeometry>();
  const geometries = new Set<THREE.BufferGeometry>();
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  const bounds = new THREE.Box3();
  const position = new THREE.Vector3();
  const scale = new THREE.Vector3();
  const rotation = new THREE.Euler();
  const quaternion = new THREE.Quaternion();
  const matrix = new THREE.Matrix4();
  let disposed = false;
  const release = (geometry: THREE.BufferGeometry) => { geometry.dispose(); geometries.delete(geometry); };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    finish.dispose();
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
    geometries.clear();
    batches.clear();
    cache.clear();
    object.clear();
  };
  const cached = (key: string, create: () => THREE.BufferGeometry) => {
    const existing = cache.get(key);
    if (existing) return existing;
    const geometry = create();
    cache.set(key, geometry);
    geometries.add(geometry);
    return geometry;
  };
  const add = (source: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, sx: number, sy: number, sz: number, rz = 0, ry = 0, rx = 0) => {
    position.set(x, y, z);
    scale.set(sx, sy, sz);
    quaternion.setFromEuler(rotation.set(rx, ry, rz));
    matrix.compose(position, quaternion, scale);
    const geometry = source.index ? source.toNonIndexed() : source.clone();
    geometry.applyMatrix4(matrix);
    geometry.computeBoundingBox();
    if (geometry.boundingBox) bounds.union(geometry.boundingBox);
    geometries.add(geometry);
    const batch = batches.get(material);
    if (batch) batch.push(geometry);
    else batches.set(material, [geometry]);
  };
  const box = (material: THREE.Material, x: number, y: number, z: number, width: number, height: number, depth: number, rz = 0) =>
    add(cached(`box`, () => new THREE.BoxGeometry()), material, x, y, z, width, height, depth, rz);
  const cylinder = cached(`cylinder`, () => new THREE.CylinderGeometry(1, 1, 1, 16));
  const torus = cached(`torus`, () => new THREE.TorusGeometry(1, 0.12, 6, 20));
  const tube = (material: THREE.Material, x: number, y: number, z: number, length: number, radius: number) =>
    add(cylinder, material, x, y, z, radius, length, radius, -Math.PI / 2);
  const ring = (x: number, y: number, radius: number, material: THREE.Material = trim) =>
    add(torus, material, x, y, 0, radius, radius, radius, 0, Math.PI / 2);
  const profile = (name: string, outline: readonly Point[], opening?: readonly Point[]) => cached(name, () => {
    const outer = outline.map(([x, y]) => new THREE.Vector2(x, y));
    if (THREE.ShapeUtils.isClockWise(outer)) outer.reverse();
    const shape = new THREE.Shape(outer);
    if (opening) {
      const inner = opening.map(([x, y]) => new THREE.Vector2(x, y));
      if (!THREE.ShapeUtils.isClockWise(inner)) inner.reverse();
      shape.holes.push(new THREE.Path(inner));
    }
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, steps: 1, bevelSize: 0.025, curveSegments: 6, bevelSegments: 2, bevelEnabled: true, bevelThickness: 0.035 });
    geometry.translate(0, 0, -0.5);
    return geometry;
  });
  const panel = (name: string, outline: readonly Point[], depth: number, material: THREE.Material = paint, z = 0) =>
    add(profile(name, outline), material, 0, 0, z, 1, 1, depth);
  const guard = (x: number, y: number, width: number, height: number) => add(profile(`guard`,
    [[-0.5, 0.5], [0.5, 0.5], [0.5, -0.3], [0.3, -0.5], [-0.35, -0.5], [-0.5, -0.25]],
    [[-0.32, 0.29], [-0.32, -0.2], [-0.22, -0.29], [0.2, -0.29], [0.31, -0.16], [0.31, 0.29]]), metal, x, y, 0, width, height, 0.12);
  const rivets = (points: readonly Point[], depth: number) => {
    points.forEach(([x, y]) => [-1, 1].forEach(side => {
      add(cylinder, trim, x, y, side * (depth / 2 + 0.012), 0.035, 0.018, 0.035, 0, 0, Math.PI / 2);
      box(metal, x, y, side * (depth / 2 + 0.024), 0.032, 0.008, 0.005);
    }));
  };
  const rail = (x: number, y: number, length: number, depth = 0.28) => {
    box(metal, x, y, 0, length, 0.045, depth);
    const count = Math.max(2, Math.round(length / 0.15));
    for (let index = 0; index < count; index += 1) box(metal, x - length / 2 + (index + 0.5) * length / count, y + 0.035, 0, 0.075, 0.04, depth);
  };
  const grooves = (x: number, y: number, length: number, depth: number, count: number, height: number) => {
    for (let index = 0; index < count; index += 1) {
      const offset = x - length / 2 + (index + 0.5) * length / count;
      [-1, 1].forEach(side => box(rubber, offset, y, side * depth / 2, 0.026, height, 0.014));
    }
  };
  try {
    if (model === `smg`) {
      panel(`smg-receiver`, [[-1.02, 0.1], [0.58, 0.1], [0.7, 0.26], [0.58, 0.64], [-0.84, 0.64], [-1.02, 0.48]], 0.43);
      panel(`smg-foreend`, [[0.6, 0.12], [1.09, 0.16], [1.09, 0.51], [0.65, 0.57]], 0.38, paintInset);
      panel(`smg-stock`, [[-1.03, 0.48], [-1.73, 0.59], [-1.82, 0.44], [-1.79, -0.03], [-1.64, -0.07], [-1.19, 0.15]], 0.3);
      box(rubber, -1.84, 0.24, 0, 0.095, 0.6, 0.35, -0.05);
      panel(`smg-grip`, [[-0.85, 0.16], [-0.48, 0.1], [-0.54, -0.87], [-0.9, -0.82], [-1.0, -0.64]], 0.31, rubber);
      panel(`smg-magazine`, [[-0.02, 0.12], [0.32, 0.12], [0.39, -0.57], [0.29, -0.85], [-0.04, -0.81]], 0.29, paintInset);
      guard(-0.21, -0.13, 0.61, 0.49);
      tube(metal, 1.28, 0.33, 0, 0.42, 0.084);
      tube(metal, 1.5, 0.33, 0, 0.14, 0.11);
      ring(1.58, 0.33, 0.105);
      rail(-0.1, 0.69, 1.4);
      grooves(0.85, 0.35, 0.37, 0.39, 5, 0.23);
      grooves(-0.76, -0.49, 0.23, 0.32, 4, 0.42);
      box(metal, -0.69, 0.81, 0, 0.13, 0.14, 0.23);
      box(trim, 0.49, 0.79, 0, 0.06, 0.1, 0.12);
      [-1, 1].forEach(side => box(metal, -0.16, 0.41, side * 0.227, 0.6, 0.055, 0.016));
      rivets([[-0.82, 0.3], [-0.4, 0.24], [0.43, 0.29]], 0.43);
    }
    if (model === `shotgun`) {
      panel(`shotgun-action`, [[-0.91, 0.02], [0.37, 0.02], [0.39, 0.44], [-0.73, 0.51], [-0.94, 0.29]], 0.38);
      panel(`shotgun-stock`, [[-0.81, 0.42], [-1.88, 0.48], [-2.08, 0.33], [-2.09, -0.43], [-1.85, -0.44], [-1.04, -0.02], [-0.64, -0.21]], 0.34, paintInset);
      box(rubber, -2.11, -0.01, 0, 0.09, 0.79, 0.39, -0.02);
      panel(`shotgun-pump`, [[0.48, 0.06], [1.43, 0.06], [1.53, 0.2], [1.44, 0.43], [0.57, 0.43], [0.47, 0.28]], 0.46);
      tube(metal, 1.26, 0.42, 0, 2.11, 0.077);
      tube(metal, 1.17, 0.16, 0, 1.85, 0.088);
      ring(2.32, 0.42, 0.078);
      tube(trim, 2.05, 0.42, 0, 0.055, 0.085);
      guard(-0.51, -0.19, 0.65, 0.45);
      grooves(0.98, 0.24, 0.84, 0.47, 9, 0.3);
      rail(-0.3, 0.55, 0.8, 0.24);
      box(metal, 1.38, 0.53, 0, 0.055, 0.1, 0.08);
      [-1, 1].forEach(side => box(metal, -0.15, 0.27, side * 0.202, 0.41, 0.13, 0.012));
      rivets([[-0.72, 0.25], [0.23, 0.25]], 0.38);
    }
    if (model === `precision`) {
      panel(`precision-stock`, [[-2.06, 0.27], [-1.05, 0.32], [-0.72, 0.13], [-0.87, -0.23], [-1.46, -0.36], [-2.04, -0.42]], 0.33, paintInset);
      panel(`precision-chassis`, [[-1.04, -0.13], [0.7, -0.13], [1.19, 0.03], [1.14, 0.33], [-0.99, 0.37]], 0.34);
      panel(`precision-grip`, [[-0.86, 0.03], [-0.48, -0.06], [-0.53, -0.91], [-0.87, -0.89], [-1.0, -0.73]], 0.29, rubber);
      box(rubber, -2.11, -0.08, 0, 0.11, 0.71, 0.4);
      box(paint, -1.62, 0.39, 0, 0.72, 0.15, 0.35);
      box(paintInset, 0.13, -0.35, 0, 0.32, 0.45, 0.27, -0.06);
      guard(-0.19, -0.19, 0.59, 0.45);
      tube(metal, 1.4, 0.29, 0, 2.8, 0.057);
      tube(metal, 2.78, 0.29, 0, 0.26, 0.085);
      ring(2.91, 0.29, 0.085);
      rail(-0.03, 0.44, 1.65);
      if (optic === `precision`) {
        [-0.48, 0.34].forEach(x => box(metal, x, 0.64, 0, 0.14, 0.28, 0.26));
        tube(metal, -0.06, 0.87, 0, 1.41, 0.115);
        tube(metal, 0.61, 0.87, 0, 0.35, 0.18);
        tube(metal, -0.77, 0.87, 0, 0.25, 0.15);
        tube(lens, 0.79, 0.87, 0, 0.012, 0.157);
        tube(lens, -0.9, 0.87, 0, 0.012, 0.128);
        ring(0.79, 0.87, 0.171, rubber);
        ring(-0.9, 0.87, 0.141, rubber);
      }
      grooves(0.78, 0.12, 0.6, 0.35, 5, 0.16);
      grooves(-0.72, -0.56, 0.2, 0.3, 4, 0.42);
      if (attachment === `bipod`) {
        [-1, 1].forEach(side => {
          box(metal, 0.97, -0.42, side * 0.24, 0.055, 0.7, 0.06, side * 0.34);
          const footX = 0.97 + side * Math.sin(0.34) * 0.35;
          const footY = -0.42 - Math.cos(0.34) * 0.35;
          box(rubber, footX, footY, side * 0.24, 0.17, 0.065, 0.1);
        });
      }
      rivets([[-1.77, 0.05], [-0.76, 0.18], [0.51, 0.13]], 0.34);
    }
    if (model === `pistol`) {
      panel(`pistol-frame`, [[-0.7, 0.04], [0.8, 0.04], [0.91, 0.16], [0.88, 0.35], [-0.61, 0.35]], 0.33, paintInset);
      panel(`pistol-slide`, [[-0.74, 0.36], [1.0, 0.36], [1.0, 0.59], [0.89, 0.7], [-0.61, 0.7], [-0.76, 0.6]], 0.37);
      panel(`pistol-grip`, [[-0.66, 0.15], [-0.25, 0.1], [-0.42, -1.0], [-0.87, -1.0], [-0.9, -0.83]], 0.32);
      const gripInsert: readonly Point[] = [[-0.67, -0.04], [-0.35, -0.07], [-0.48, -0.88], [-0.78, -0.88], [-0.82, -0.72]];
      [-1, 1].forEach(side => {
        panel(`pistol-grip-insert`, gripInsert, 0.025, rubber, side * 0.175);
        box(metal, 0.28, 0.51, side * 0.198, 0.66, 0.045, 0.012);
      });
      guard(0.13, -0.22, 0.81, 0.51);
      tube(metal, 1.02, 0.5, 0, 0.1, 0.067);
      ring(1.08, 0.5, 0.069, metal);
      grooves(-0.51, 0.52, 0.35, 0.385, 5, 0.23);
      box(metal, -0.62, 0.75, 0, 0.12, 0.095, 0.21);
      box(trim, 0.9, 0.75, 0, 0.055, 0.095, 0.065);
      rail(0.61, 0.01, 0.43, 0.23);
      rivets([[-0.63, -0.2], [-0.65, -0.77]], 0.36);
      rivets([[-0.53, 0.21]], 0.33);
    }
    if (bounds.isEmpty()) throw new Error(`Unknown Gun Presentation Model`);
    const center = bounds.getCenter(new THREE.Vector3());
    const framingPoints: THREE.Vector3[] = [];
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) framingPoints.push(new THREE.Vector3(x, y, z).sub(center));
      }
    }
    batches.forEach((parts, material) => {
      const geometry = mergeGeometries(parts, false);
      if (!geometry) throw new Error(`Unable To Assemble Gun Presentation Model`);
      geometries.add(geometry);
      geometry.translate(-center.x, -center.y, -center.z);
      geometry.computeBoundingSphere();
      const mesh = new THREE.Mesh(geometry, material);
      mesh.name = `${model.toUpperCase()} Material Batch`;
      object.add(mesh);
      parts.forEach(release);
    });
    batches.clear();
    cache.forEach(release);
    cache.clear();
    finish.setSkin(skin);
    const setSkin = (next: SkinId) => { if (!disposed) finish.setSkin(next); };
    return { object, setSkin, dispose, framingPoints, origin: center.clone() };
  } catch (error) { dispose(); throw error; }
};