import * as THREE from 'three';
import { createSurfaceDetail } from './surfaceDetail';
import { createWeaponFinish } from './weaponFinishes';
import type { SkinId, WeaponModelId } from '../../types/types';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Point = readonly [number, number];
type Point3D = readonly [number, number, number];
type Axis = `x` | `y` | `z`;

export const createModelAssembly = (model: WeaponModelId) => {
  const object = new THREE.Group();
  object.name = `${model.toUpperCase()} Presentation Model`;
  const coated = [`rifle`, `smg`, `shotgun`, `precision`, `marksman`, `pistol`, `recurvebow`, `compoundbow`].includes(model);
  const medieval = model === `greatsword` || model === `falchion`;
  const paint = new THREE.MeshStandardMaterial({ color: 0x63746a, metalness: medieval ? .06 : .38, roughness: medieval ? .82 : .55 });
  const paintInset = new THREE.MeshStandardMaterial({ color: 0x43544a, metalness: medieval ? .04 : .28, roughness: medieval ? .88 : .68 });
  const metal = new THREE.MeshStandardMaterial({ color: coated ? 0x2b3339 : medieval ? 0x889399 : 0x9aa8b1, metalness: coated ? .86 : .92, roughness: coated ? .38 : medieval ? .39 : .28 });
  const rubber = new THREE.MeshStandardMaterial({ color: medieval ? 0x211c19 : 0x182027, metalness: 0.06, roughness: medieval ? .94 : .9 });
  const trim = new THREE.MeshStandardMaterial({ color: coated ? 0x69767e : medieval ? 0xb49c62 : 0xb3a17a, metalness: 0.86, roughness: medieval ? .43 : .32 });
  const recess = new THREE.MeshStandardMaterial({ color: 0x0b1014, metalness: .12, roughness: .86 });
  const anodized = new THREE.MeshStandardMaterial({ color: 0x252b30, metalness: .72, roughness: .43 });
  const lens = new THREE.MeshPhysicalMaterial({
    clearcoat: 1,
    depthWrite: false,
    transparent: true,
    opacity: coated ? .46 : medieval ? .92 : .28,
    roughness: coated ? .06 : medieval ? .15 : .12,
    metalness: coated ? .12 : medieval ? .16 : .4,
    color: coated ? 0x254654 : medieval ? 0x1b4435 : 0x447e91,
    clearcoatRoughness: coated ? .035 : .08,
    side: coated ? THREE.DoubleSide : THREE.FrontSide,
  });
  const reticle = new THREE.MeshBasicMaterial({ color: 0xff453b });
  const materials = [paint, paintInset, metal, rubber, trim, recess, anodized, lens, reticle];
  const finishes = createWeaponFinish([paint, paintInset], object, { studio: coated || medieval });
  const surfaceDetail = coated || medieval ? createSurfaceDetail([
    { kind: `paint`, material: paint },
    { kind: `metal`, material: metal },
    { kind: `metal`, material: trim },
    { kind: `rubber`, material: rubber },
    { kind: `paint`, material: paintInset },
    { kind: `metal`, material: anodized },
  ], object) : undefined;
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
    finishes.dispose();
    surfaceDetail?.dispose();
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
  const bake = (source: THREE.BufferGeometry, material: THREE.Material, transform: THREE.Matrix4) => {
    const geometry = source.index ? source.toNonIndexed() : source.clone();
    geometries.add(geometry);
    geometry.applyMatrix4(transform);
    geometry.computeBoundingBox();
    if (geometry.boundingBox) bounds.union(geometry.boundingBox);
    const batch = batches.get(material);
    if (batch) batch.push(geometry);
    else batches.set(material, [geometry]);
  };
  const add = (source: THREE.BufferGeometry, material: THREE.Material, x: number, y: number, z: number, sx = 1, sy = 1, sz = 1, rz = 0, ry = 0, rx = 0) => {
    position.set(x, y, z);
    scale.set(sx, sy, sz);
    quaternion.setFromEuler(rotation.set(rx, ry, rz));
    matrix.compose(position, quaternion, scale);
    bake(source, material, matrix);
  };
  const box = (material: THREE.Material, x: number, y: number, z: number, width: number, height: number, depth: number, rz = 0, ry = 0, rx = 0) =>
    add(cached(`box`, () => new THREE.BoxGeometry()), material, x, y, z, width, height, depth, rz, ry, rx);
  const cylinderGeometry = () => cached(`cylinder`, () => new THREE.CylinderGeometry(1, 1, 1, 18));
  const cylinder = (material: THREE.Material, x: number, y: number, z: number, radius: number, length: number, axis: Axis = `y`) =>
    add(cylinderGeometry(), material, x, y, z, radius, length, radius, axis === `x` ? -Math.PI / 2 : 0, 0, axis === `z` ? Math.PI / 2 : 0);
  const tube = (material: THREE.Material, x: number, y: number, z: number, length: number, radius: number) => cylinder(material, x, y, z, radius, length, `x`);
  const ring = (material: THREE.Material, x: number, y: number, z: number, radius: number, axis: Axis = `z`) =>
    add(cached(`ring`, () => new THREE.TorusGeometry(1, 0.1, 6, 24)), material, x, y, z, radius, radius, radius, 0, axis === `x` ? Math.PI / 2 : 0, axis === `y` ? Math.PI / 2 : 0);
  const ellipsoid = (material: THREE.Material, x: number, y: number, z: number, rx: number, ry: number, rz: number) =>
    add(cached(`sphere`, () => new THREE.SphereGeometry(1, 20, 12)), material, x, y, z, rx, ry, rz);
  const beam = (material: THREE.Material, from: Point3D, to: Point3D, radius: number) => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = end.clone().sub(start);
    const length = direction.length();
    if (length < 0.0001) return;
    const orientation = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.multiplyScalar(1 / length));
    const transform = new THREE.Matrix4().compose(start.add(end).multiplyScalar(0.5), orientation, new THREE.Vector3(radius, length, radius));
    bake(cylinderGeometry(), material, transform);
  };
  const custom = (name: string, create: () => THREE.BufferGeometry, material: THREE.Material, x = 0, y = 0, z = 0) =>
    add(cached(`custom:${name}`, create), material, x, y, z);
  const panel = (name: string, outline: readonly Point[], depth: number, material: THREE.Material = paint, z = 0) => {
    const geometry = cached(`profile:${name}`, () => {
      const points = outline.map(([x, y]) => new THREE.Vector2(x, y));
      if (THREE.ShapeUtils.isClockWise(points)) points.reverse();
      const result = new THREE.ExtrudeGeometry(new THREE.Shape(points), { depth: 1, steps: 1, bevelSize: 0.015, curveSegments: 6, bevelSegments: 2, bevelEnabled: true, bevelThickness: 0.035 });
      result.translate(0, 0, -0.5);
      return result;
    });
    add(geometry, material, 0, 0, z, 1, 1, depth);
  };
  const finish = (skin: SkinId) => {
    if (bounds.isEmpty()) throw new Error(`Unknown Weapon Presentation Model`);
    const center = bounds.getCenter(new THREE.Vector3());
    const framingPoints: THREE.Vector3[] = [];
    for (const x of [bounds.min.x, bounds.max.x]) {
      for (const y of [bounds.min.y, bounds.max.y]) {
        for (const z of [bounds.min.z, bounds.max.z]) framingPoints.push(new THREE.Vector3(x, y, z).sub(center));
      }
    }
    batches.forEach((parts, material) => {
      const geometry = mergeGeometries(parts, false);
      if (!geometry) throw new Error(`Unable To Assemble Weapon Presentation Model`);
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
    surfaceDetail?.prepare();
    finishes.setSkin(skin);
    return { object, dispose, framingPoints, origin: center.clone(), setSkin: finishes.setSkin };
  };
  return { paint, paintInset, metal, rubber, trim, lens, reticle, recess, anodized, box, panel, tube, cylinder, ellipsoid, ring, beam, custom, finish, dispose, hasGeometry: () => !bounds.isEmpty() };
};

export type ModelAssembly = ReturnType<typeof createModelAssembly>;
