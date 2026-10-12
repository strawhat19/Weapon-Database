import * as THREE from 'three';
import { createSurfaceDetail } from './surfaceDetail';
import { createWeaponFinish } from './weaponFinishes';
import { createReferenceSurfaces } from './referenceSurfaces';
import type { GunModelId, SkinId } from '../../types/types';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

type Point = readonly [number, number];

export const createGunGeometry = (model: Exclude<GunModelId, `rifle`>, onSurfaceReady?: () => void) => {
  const object = new THREE.Group();
  object.name = `${model.toUpperCase()} Presentation Model`;
  const paint = new THREE.MeshStandardMaterial({ color: 0xaeb9aa, metalness: 0.42, roughness: 0.49 });
  const paintInset = new THREE.MeshStandardMaterial({ color: 0x75856d, metalness: 0.32, roughness: 0.58 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x353c42, metalness: 0.84, roughness: 0.31 });
  const recess = new THREE.MeshStandardMaterial({ color: 0x101316, metalness: .15, roughness: .83 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x20262b, metalness: 0.04, roughness: 0.86 });
  const trim = new THREE.MeshStandardMaterial({ color: 0x89949b, metalness: 0.92, roughness: 0.26 });
  const lens = new THREE.MeshPhysicalMaterial({ color: 0x407e92, metalness: 0.4, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 });
  const materials = [paint, paintInset, metal, rubber, trim, lens, recess];
  const finish = createWeaponFinish([paint, paintInset], object, { studio: true });
  const surface = createSurfaceDetail([
    { kind: `metal`, material: trim },
    { kind: `paint`, material: paint },
    { kind: `metal`, material: metal },
    { kind: `rubber`, material: rubber },
    { kind: `paint`, material: paintInset },
  ], object);
  const reference = model === `marksman` ? undefined : createReferenceSurfaces(model, onSurfaceReady);
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
    reference?.dispose();
    finish.dispose();
    surface.dispose();
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
    const collect = (part: THREE.BufferGeometry, surface: THREE.Material) => {
      geometries.add(part);
      const batch = batches.get(surface);
      if (batch) batch.push(part);
      else batches.set(surface, [part]);
    };
    const standard = material as THREE.MeshStandardMaterial;
    if (!reference || !standard.isMeshStandardMaterial || material === recess) { collect(geometry, material); return; }
    const normals = geometry.getAttribute(`normal`);
    const sides: number[] = [], edges: number[] = [];
    for (let index = 0; index < normals.count; index += 3) {
      const target = Math.abs(normals.getZ(index) + normals.getZ(index + 1) + normals.getZ(index + 2)) > 2.4 ? sides : edges;
      target.push(index, index + 1, index + 2);
    }
    if (!sides.length) { collect(geometry, material); return; }
    const sideSource = geometry.clone();
    sideSource.setIndex(sides);
    const sideGeometry = sideSource.toNonIndexed();
    sideSource.dispose();
    reference.prepare(sideGeometry);
    collect(sideGeometry, reference.material(standard));
    if (edges.length) {
      geometry.setIndex(edges);
      collect(geometry.toNonIndexed(), material);
    }
    geometry.dispose();
  };
  const cylinderShape = cached(`cylinder`, () => new THREE.CylinderGeometry(1, 1, 1, 24));
  const torus = cached(`torus`, () => new THREE.TorusGeometry(1, 0.075, 8, 28));
  const cylinder = (material: THREE.Material, x: number, y: number, z: number, radius: number, length: number, axis: `x` | `y` | `z` = `y`) =>
    add(cylinderShape, material, x, y, z, radius, length, radius, axis === `x` ? -Math.PI / 2 : 0, 0, axis === `z` ? Math.PI / 2 : 0);
  const ellipsoid = (material: THREE.Material, x: number, y: number, z: number, rx: number, ry: number, rz: number) =>
    add(cached(`sphere`, () => new THREE.SphereGeometry(1, 20, 12)), material, x, y, z, rx, ry, rz);
  const tube = (material: THREE.Material, x: number, y: number, z: number, length: number, radius: number) =>
    add(cylinderShape, material, x, y, z, radius, length, radius, -Math.PI / 2);
  const ring = (x: number, y: number, radius: number, material: THREE.Material = trim) =>
    add(torus, material, x, y, 0, radius, radius, radius, 0, Math.PI / 2);
  const roundedPath = (points: readonly THREE.Vector2[], path: THREE.Path, roundness: number) => {
    const corners = points.map((point, index) => {
      const previous = points[(index + points.length - 1) % points.length];
      const next = points[(index + 1) % points.length];
      const incoming = previous.clone().sub(point);
      const outgoing = next.clone().sub(point);
      const radius = Math.min(roundness, incoming.length() * .3, outgoing.length() * .3);
      return { point, start: incoming.setLength(radius).add(point), end: outgoing.setLength(radius).add(point) };
    });
    corners.forEach(({ point, start, end }, index) => {
      if (index) path.lineTo(start.x, start.y);
      else path.moveTo(start.x, start.y);
      path.quadraticCurveTo(point.x, point.y, end.x, end.y);
    });
    path.closePath();
    return path;
  };
  const profile = (name: string, outline: readonly Point[], openings: readonly (readonly Point[])[] = [], roundness = .025) => cached(name, () => {
    const outer = outline.map(([x, y]) => new THREE.Vector2(x, y));
    if (THREE.ShapeUtils.isClockWise(outer)) outer.reverse();
    const shape = new THREE.Shape();
    roundedPath(outer, shape, roundness);
    openings.forEach(opening => {
      const inner = opening.map(([x, y]) => new THREE.Vector2(x, y));
      if (!THREE.ShapeUtils.isClockWise(inner)) inner.reverse();
      shape.holes.push(roundedPath(inner, new THREE.Path(), Math.min(roundness, .02)));
    });
    const bevelDepth = .06;
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: 1, steps: 1, bevelSize: .008, curveSegments: 4, bevelSegments: 3, bevelEnabled: true, bevelThickness: bevelDepth });
    geometry.translate(0, 0, -0.5);
    geometry.scale(1, 1, 1 / (1 + bevelDepth * 2));
    return geometry;
  });
  const box = (material: THREE.Material, x: number, y: number, z: number, width: number, height: number, depth: number, rz = 0) =>
    add(profile(`beveled-box`, [[-.5, -.5], [.5, -.5], [.5, .5], [-.5, .5]], [], .04), material, x, y, z, width, height, depth, rz);
  const panel = (name: string, outline: readonly Point[], depth: number, material: THREE.Material = paint, z = 0, openings: readonly (readonly Point[])[] = [], roundness = .025) =>
    add(profile(name, outline, openings, roundness), material, 0, 0, z, 1, 1, depth);
  const sidePanels = (name: string, outline: readonly Point[], depth: number, material: THREE.Material, offset: number) =>
    [-1, 1].forEach(side => panel(name, outline, depth, material, side * offset));
  const lathed = (name: string, points: readonly Point[], material: THREE.Material, x: number, y: number, length: number, radiusY: number, radiusZ = radiusY) =>
    add(cached(name, () => new THREE.LatheGeometry(points.map(([radius, height]) => new THREE.Vector2(radius, height)), 28)), material, x, y, 0, radiusY, length, radiusZ, -Math.PI / 2);
  const sleeve = (material: THREE.Material, x: number, y: number, length: number, radius: number) =>
    lathed(`hollow-sleeve`, [[.65, -.5], [.91, -.5], [1, -.43], [1, .43], [.91, .5], [.65, .5], [.65, -.5]], material, x, y, length, radius);
  const guard = (x: number, y: number, width: number, height: number) => add(profile(`guard`,
    [[-.5, .5], [.5, .5], [.5, -.16], [.41, -.39], [.22, -.5], [-.27, -.5], [-.48, -.32]],
    [[[-.36, .34], [-.36, -.2], [-.24, -.34], [.19, -.34], [.34, -.22], [.36, .34]]], .075), metal, x, y, 0, width, height, .12);
  const trigger = (x: number, y: number, width: number, height: number) => add(profile(`trigger`,
    [[-.15, .5], [.12, .5], [.07, .06], [.25, -.32], [.34, -.43], [.16, -.5], [-.05, -.23], [-.17, .03]], [], .05), metal, x, y, 0, width, height, .06);
  const rivets = (points: readonly Point[], depth: number) => {
    points.forEach(([x, y]) => [-1, 1].forEach(side => {
      add(cylinderShape, metal, x, y, side * (depth / 2 + .008), .041, .022, .041, 0, 0, Math.PI / 2);
      add(cylinderShape, trim, x, y, side * (depth / 2 + .021), .028, .009, .028, 0, 0, Math.PI / 2);
      box(rubber, x, y, side * (depth / 2 + .028), .031, .008, .004, -.25);
    }));
  };
  const rail = (x: number, y: number, length: number, depth = 0.28) => {
    box(metal, x, y, 0, length, 0.045, depth);
    const count = Math.max(2, Math.round(length / 0.15));
    for (let index = 0; index < count; index += 1) box(metal, x - length / 2 + (index + 0.5) * length / count, y + 0.035, 0, 0.075, 0.04, depth);
  };
  const grooves = (x: number, y: number, length: number, depth: number, count: number, height: number, angle = 0, material: THREE.Material = rubber) => {
    for (let index = 0; index < count; index += 1) {
      const offset = x - length / 2 + (index + 0.5) * length / count;
      [-1, 1].forEach(side => box(material, offset, y, side * depth / 2, .018, height, .012, angle));
    }
  };
  const finishModel = (skin: SkinId) => {
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
    surface.prepare();
    finish.setSkin(skin);
    reference?.setSkin(skin);
    const setSkin = (next: SkinId) => { if (!disposed) { finish.setSkin(next); reference?.setSkin(next); } };
    return { object, setSkin, dispose, framingPoints, origin: center.clone() };
  };
  return { paint, metal, rubber, trim, lens, recess, paintInset, box, tube, ring, rail, guard, panel, sleeve, rivets, grooves, trigger, lathed, cylinder, ellipsoid, sidePanels, dispose, finish: finishModel };
};

export type GunGeometry = ReturnType<typeof createGunGeometry>;
