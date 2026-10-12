import * as THREE from 'three';
import type { ModelAssembly } from './modelAssembly';

type Point = readonly [number, number];

export const createAttachmentDetails = (assembly: ModelAssembly) => {
  const sleeve = (material: THREE.Material, x: number, y: number, z: number, length: number, rearRadius: number, frontRadius = rearRadius, wall = rearRadius * .17) => {
    const key = `attachment-sleeve:${length}:${rearRadius}:${frontRadius}:${wall}`;
    assembly.custom(key, () => {
      const profile = [[rearRadius - wall, -length * .5], [rearRadius, -length * .5], [frontRadius, length * .5], [frontRadius - wall, length * .5], [rearRadius - wall, -length * .5]];
      return new THREE.LatheGeometry(profile.map(([radius, offset]) => new THREE.Vector2(radius, offset)), 36).rotateZ(-Math.PI / 2);
    }, material, x, y, z);
  };
  const glass = (x: number, y: number, z: number, radius: number, facing = 1) => {
    assembly.custom(`attachment-glass:${radius}:${facing}`, () => new THREE.CircleGeometry(radius, 36).rotateY(facing * Math.PI / 2), assembly.lens, x, y, z);
  };
  const window = (key: string, x: number, y: number, size: number, outline: readonly Point[], opening?: readonly Point[]) => {
    assembly.custom(`attachment-window:${key}:${size}`, () => {
      const outer = outline.map(([horizontal, vertical]) => new THREE.Vector2(horizontal * size, vertical * size));
      if (THREE.ShapeUtils.isClockWise(outer)) outer.reverse();
      const shape = new THREE.Shape(outer);
      if (opening) {
        const inner = opening.map(([horizontal, vertical]) => new THREE.Vector2(horizontal * size, vertical * size));
        if (!THREE.ShapeUtils.isClockWise(inner)) inner.reverse();
        shape.holes.push(new THREE.Path(inner));
      }
      if (!opening) return new THREE.ShapeGeometry(shape, 8).rotateY(Math.PI / 2).rotateZ(-.10);
      const geometry = new THREE.ExtrudeGeometry(shape, { steps: 1, depth: .07 * size, curveSegments: 8, bevelSegments: 2, bevelEnabled: true, bevelSize: .009 * size, bevelThickness: .009 * size });
      return geometry.translate(0, 0, -.035 * size).rotateY(Math.PI / 2).rotateZ(-.10);
    }, opening ? assembly.anodized : assembly.lens, x, y, 0);
  };
  const fastener = (x: number, y: number, z: number, radius: number) => {
    assembly.cylinder(assembly.trim, x, y, z, radius, radius * .24, `z`);
    assembly.box(assembly.recess, x, y, z + Math.sign(z || 1) * radius * .16, radius * 1.05, radius * .28, radius * .12);
  };
  const knurl = (x: number, y: number, z: number, radius: number, length: number, count = 24) => {
    for (let index = 0; index < count; index += 1) {
      const angle = index * Math.PI * 2 / count;
      assembly.box(assembly.trim, x, y + Math.cos(angle) * radius, z + Math.sin(angle) * radius, length, radius * .045, radius * .12, 0, 0, angle);
    }
  };
  return { glass, knurl, sleeve, window, fastener };
};
