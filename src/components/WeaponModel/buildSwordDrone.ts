import type { ModelAssembly } from './modelAssembly';
import { BufferGeometry, ExtrudeGeometry, Float32BufferAttribute, Shape } from 'three';

export type SwordDroneModelId = `longsword` | `katana` | `saber` | `quadcopter` | `fixedwing`;
type BladeStation = readonly [x: number, y: number, halfWidth: number];
type Point = readonly [number, number, number];

const createBladeGeometry = (stations: readonly BladeStation[], thickness: number) => {
  const vertices: number[] = [];
  const textureCoordinates: number[] = [];
  const sections = stations.map(([x, y, width], index) => {
    const previous = stations[Math.max(0, index - 1)];
    const next = stations[Math.min(stations.length - 1, index + 1)];
    const deltaX = next[0] - previous[0];
    const deltaY = next[1] - previous[1];
    const length = Math.hypot(deltaX, deltaY) || 1;
    const normalX = -deltaY / length;
    const normalY = deltaX / length;
    return [[x + normalX * width, y + normalY * width, 0], [x, y, thickness / 2], [x - normalX * width, y - normalY * width, 0], [x, y, -thickness / 2]] satisfies Point[];
  });
  const firstX = stations[0][0];
  const span = stations[stations.length - 1][0] - firstX || 1;
  const triangle = (a: Point, b: Point, c: Point) => {
    [a, b, c].forEach(([x, y, z]) => {
      vertices.push(x, y, z);
      textureCoordinates.push((x - firstX) / span, y + 0.5);
    });
  };
  for (let index = 0; index < sections.length - 1; index += 1) {
    const current = sections[index];
    const next = sections[index + 1];
    for (let side = 0; side < 4; side += 1) {
      const following = (side + 1) % 4;
      triangle(current[side], current[following], next[following]);
      triangle(current[side], next[following], next[side]);
    }
  }
  const first = stations[0];
  const last = stations[stations.length - 1];
  for (let side = 0; side < 4; side += 1) {
    const following = (side + 1) % 4;
    triangle([first[0], first[1], 0], sections[0][following], sections[0][side]);
    triangle([last[0], last[1], 0], sections[sections.length - 1][side], sections[sections.length - 1][following]);
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute(`position`, new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute(`uv`, new Float32BufferAttribute(textureCoordinates, 2));
  geometry.computeVertexNormals();
  return geometry;
};

const createWingGeometry = (outline: readonly (readonly [number, number])[], thickness: number) => {
  const shape = new Shape();
  outline.forEach(([x, z], index) => index ? shape.lineTo(x, -z) : shape.moveTo(x, -z));
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { steps: 1, depth: thickness, bevelEnabled: true, bevelSegments: 1, bevelSize: 0.025, bevelThickness: 0.025 });
  geometry.translate(0, 0, -thickness / 2);
  geometry.rotateX(-Math.PI / 2);
  return geometry;
};

export const assembleSwordDrone = (model: SwordDroneModelId, assembly: ModelAssembly) => {
  const { paint, paintInset, metal, rubber, trim, lens } = assembly;
  const blade = (name: string, stations: readonly BladeStation[], thickness = 0.09) => assembly.custom(name, () => createBladeGeometry(stations, thickness), metal);
  const grip = (x: number, y: number, length: number, radius: number, bands: number) => {
    assembly.cylinder(rubber, x, y, 0, radius, length, `x`);
    for (let index = 0; index < bands; index += 1) {
      const bandX = x - length / 2 + (index + 0.5) * length / bands;
      assembly.ring(paintInset, bandX, y, 0, radius + 0.006, `x`);
      assembly.box(paint, bandX, y, radius + 0.01, length / bands * 0.34, radius * 1.45, 0.018, 0.55);
      assembly.box(paint, bandX, y, -radius - 0.01, length / bands * 0.34, radius * 1.45, 0.018, -0.55);
    }
  };
  if (model === `longsword`) {
    blade(`longsword-blade`, [[-0.86, 0, 0.18], [-0.63, 0, 0.18], [1.67, 0, 0.135], [2.15, 0, 0.105], [2.65, 0, 0.006]]);
    assembly.panel(`longsword-guard`, [[-1.04, -0.65], [-0.83, -0.63], [-0.77, -0.53], [-0.88, -0.26], [-0.88, 0.26], [-0.77, 0.53], [-0.83, 0.63], [-1.04, 0.65], [-1.07, 0.50], [-1.02, 0.21], [-1.02, -0.21], [-1.07, -0.50]], 0.14, paint);
    assembly.cylinder(trim, -0.94, 0, 0, 0.19, 0.12, `x`);
    grip(-1.63, 0, 1.14, 0.12, 10);
    assembly.cylinder(trim, -2.25, 0, 0, 0.14, 0.1, `x`);
    assembly.ellipsoid(paint, -2.39, 0, 0, 0.18, 0.22, 0.13);
    assembly.cylinder(trim, -2.39, 0, 0.135, 0.1, 0.035, `z`);
    assembly.cylinder(paintInset, -2.39, 0, 0.16, 0.055, 0.035, `z`);
    assembly.beam(trim, [-0.68, 0, 0.051], [1.75, 0, 0.051], 0.013);
    assembly.box(paintInset, -0.99, 0.51, 0, 0.16, 0.1, 0.17);
    assembly.box(paintInset, -0.99, -0.51, 0, 0.16, 0.1, 0.17);
    return;
  }
  if (model === `katana`) {
    blade(`katana-blade`, [[-0.96, 0, 0.12], [-0.48, 0.015, 0.125], [0.20, 0.065, 0.13], [0.92, 0.17, 0.125], [1.62, 0.33, 0.11], [2.16, 0.52, 0.09], [2.57, 0.70, 0.005]], 0.08);
    assembly.cylinder(trim, -1.02, 0, 0, 0.14, 0.15, `x`);
    assembly.cylinder(paint, -1.14, 0, 0, 0.31, 0.065, `x`);
    assembly.ring(trim, -1.14, 0, 0, 0.29, `x`);
    grip(-1.78, 0, 1.18, 0.125, 11);
    assembly.cylinder(paint, -2.41, 0, 0, 0.145, 0.12, `x`);
    assembly.cylinder(trim, -2.47, 0, 0, 0.105, 0.035, `x`);
    assembly.box(trim, -1.53, 0, 0.143, 0.13, 0.055, 0.035, 0.3);
    assembly.box(trim, -2.05, 0, -0.143, 0.13, 0.055, 0.035, -0.3);
    assembly.beam(trim, [-0.82, 0.04, 0.045], [0.19, 0.1, 0.045], 0.008);
    assembly.beam(trim, [0.19, 0.1, 0.045], [0.91, 0.20, 0.045], 0.008);
    assembly.beam(trim, [0.91, 0.20, 0.045], [1.57, 0.35, 0.045], 0.008);
    return;
  }
  if (model === `saber`) {
    blade(`saber-blade`, [[-0.91, 0, 0.16], [-0.25, 0.035, 0.165], [0.48, 0.13, 0.16], [1.16, 0.29, 0.15], [1.81, 0.52, 0.13], [2.26, 0.75, 0.095], [2.59, 0.98, 0.005]], 0.095);
    assembly.panel(`saber-guard`, [[-1.08, -0.37], [-0.89, -0.32], [-0.88, 0.16], [-0.97, 0.32], [-1.13, 0.30], [-1.20, 0.13], [-1.18, -0.23]], 0.17, paint);
    grip(-1.66, -0.03, 0.94, 0.125, 8);
    assembly.ellipsoid(paint, -2.18, -0.03, 0, 0.15, 0.17, 0.14);
    const guardBow: readonly Point[] = [[-0.99, 0.28, 0.02], [-1.39, 0.49, 0.02], [-1.93, 0.43, 0.02], [-2.24, 0.16, 0.02], [-2.20, -0.10, 0.02]];
    for (let index = 0; index < guardBow.length - 1; index += 1) assembly.beam(trim, guardBow[index], guardBow[index + 1], 0.055);
    assembly.cylinder(trim, -1.12, -0.33, 0, 0.11, 0.16, `z`);
    assembly.cylinder(paintInset, -2.18, -0.03, 0.15, 0.08, 0.03, `z`);
    assembly.beam(trim, [-0.70, 0.04, 0.052], [0.46, 0.17, 0.052], 0.01);
    assembly.beam(trim, [0.46, 0.17, 0.052], [1.13, 0.32, 0.052], 0.01);
    return;
  }
  if (model === `quadcopter`) {
    assembly.ellipsoid(paint, 0, 0.10, 0, 0.66, 0.24, 0.38);
    assembly.panel(`quadcopter-shell`, [[-0.58, 0.06], [-0.49, 0.28], [-0.08, 0.37], [0.44, 0.25], [0.61, 0.08], [0.41, -0.09], [-0.42, -0.10]], 0.56, paint);
    assembly.box(paintInset, -0.05, 0.34, 0, 0.6, 0.035, 0.31);
    assembly.box(trim, -0.35, 0.38, 0, 0.12, 0.045, 0.26);
    assembly.ellipsoid(rubber, 0.48, -0.13, 0, 0.21, 0.19, 0.21);
    assembly.cylinder(trim, 0.68, -0.13, 0, 0.13, 0.09, `x`);
    assembly.cylinder(lens, 0.735, -0.13, 0, 0.103, 0.022, `x`);
    assembly.cylinder(lens, 0.43, -0.11, 0.19, 0.085, 0.025, `z`);
    [-1, 1].forEach(lengthSide => {
      [-1, 1].forEach(spanSide => {
        const x = lengthSide * 1.55;
        const z = spanSide * 1.35;
        assembly.beam(paintInset, [lengthSide * 0.36, 0.11, spanSide * 0.22], [x, 0.13, z], 0.092);
        assembly.beam(trim, [lengthSide * 0.42, 0.04, spanSide * 0.24], [x, 0.06, z], 0.035);
        assembly.cylinder(paint, x, 0.15, z, 0.15, 0.24, `y`);
        assembly.cylinder(rubber, x, 0.29, z, 0.12, 0.065, `y`);
        assembly.cylinder(trim, x, 0.33, z, 0.07, 0.05, `y`);
        const angle = lengthSide * spanSide * 0.58;
        assembly.box(rubber, x, 0.36, z, 1.04, 0.025, 0.085, 0, angle);
        assembly.box(paintInset, x, 0.36, z, 0.085, 0.027, 0.98, 0, angle);
        assembly.ring(paintInset, x, 0.31, z, 0.58, `y`);
        assembly.beam(trim, [x, 0.19, z], [x + lengthSide * 0.50, 0.28, z], 0.025);
        assembly.beam(trim, [x, 0.19, z], [x, 0.28, z + spanSide * 0.50], 0.025);
      });
    });
    [-1, 1].forEach(side => {
      const z = side * 0.47;
      assembly.beam(rubber, [-0.68, -0.45, z], [0.69, -0.45, z], 0.045);
      assembly.beam(trim, [-0.38, -0.04, side * 0.25], [-0.48, -0.45, z], 0.032);
      assembly.beam(trim, [0.34, -0.04, side * 0.25], [0.47, -0.45, z], 0.032);
    });
    assembly.ellipsoid(lens, -0.45, 0.18, 0.29, 0.085, 0.035, 0.04);
    return;
  }
  if (model === `fixedwing`) {
    assembly.custom(`fixedwing-main-wing`, () => createWingGeometry([[-0.49, -0.30], [-1.03, -2.13], [-0.78, -2.44], [-0.12, -2.41], [1.00, -0.37], [1.00, 0.37], [-0.12, 2.41], [-0.78, 2.44], [-1.03, 2.13], [-0.49, 0.30]], 0.075), paint, 0, 0.035);
    assembly.ellipsoid(paintInset, 0.10, 0.08, 0, 1.72, 0.25, 0.30);
    assembly.ellipsoid(paint, 1.65, 0.055, 0, 0.42, 0.22, 0.24);
    assembly.ellipsoid(lens, 0.43, 0.285, 0, 0.59, 0.125, 0.20);
    assembly.custom(`fixedwing-tailplane`, () => createWingGeometry([[-1.80, -0.15], [-2.02, -0.87], [-1.54, -0.82], [-1.11, -0.15], [-1.11, 0.15], [-1.54, 0.82], [-2.02, 0.87], [-1.80, 0.15]], 0.06), paintInset, 0, 0.14);
    assembly.panel(`fixedwing-dorsal-fin`, [[-1.97, 0.16], [-1.86, 0.74], [-1.46, 0.72], [-1.12, 0.16]], 0.075, paint);
    assembly.panel(`fixedwing-fin-inset`, [[-1.82, 0.30], [-1.73, 0.61], [-1.49, 0.61], [-1.30, 0.30]], 0.025, paintInset, 0.055);
    assembly.cylinder(trim, -1.82, 0.10, 0, 0.115, 0.23, `x`);
    assembly.box(rubber, -1.97, 0.10, 0, 0.03, 0.76, 0.075, 0, 0, 0.40);
    assembly.cylinder(paintInset, -2.01, 0.10, 0, 0.10, 0.10, `x`);
    [-1, 1].forEach(side => {
      assembly.beam(trim, [-0.79, 0.115, side * 2.15], [-0.35, 0.115, side * 2.20], 0.023);
      assembly.beam(paintInset, [-0.54, 0.115, side * 1.64], [0.22, 0.115, side * 1.70], 0.023);
      assembly.ellipsoid(lens, -0.56, 0.085, side * 2.43, 0.10, 0.035, 0.055);
    });
    assembly.ellipsoid(rubber, 1.09, -0.20, 0, 0.18, 0.15, 0.18);
    assembly.cylinder(trim, 1.13, -0.23, 0.17, 0.10, 0.04, `z`);
    assembly.cylinder(lens, 1.13, -0.23, 0.198, 0.075, 0.025, `z`);
    assembly.beam(rubber, [-0.55, -0.20, 0], [0.65, -0.24, 0], 0.045);
  }
};

