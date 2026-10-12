import { Shape, ExtrudeGeometry } from 'three';
import type { OpticId } from '../../types/types';
import type { ModelAssembly } from './modelAssembly';

export type CrossbowModelId = `recurvebow` | `compoundbow`;

const createRecurveLimb = (side: number) => {
  const shape = new Shape();
  shape.moveTo(1.2, 0.25 * side);
  shape.bezierCurveTo(1.68, 0.62 * side, 1.67, 1.34 * side, 1.26, 1.76 * side);
  shape.bezierCurveTo(1.05, 1.99 * side, 0.94, 2.09 * side, 0.78, 2.1 * side);
  shape.lineTo(0.74, 1.96 * side);
  shape.bezierCurveTo(0.92, 1.97 * side, 1.04, 1.73 * side, 1.15, 1.54 * side);
  shape.bezierCurveTo(1.44, 1.12 * side, 1.48, 0.65 * side, 1.12, 0.42 * side);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, { depth: 0.09, steps: 1, bevelSize: 0.025, curveSegments: 10, bevelSegments: 2, bevelEnabled: true, bevelThickness: 0.025 });
  geometry.rotateX(Math.PI / 2 - side * 0.11);
  geometry.translate(0, 0.22, 0);
  return geometry;
};

export const assembleCrossbow = (model: CrossbowModelId, assembly: ModelAssembly, optic: OpticId = `precision`): void => {
  const { box, beam, tube, ring, panel, custom, cylinder, ellipsoid } = assembly;
  const { paint, metal, rubber, trim, lens, paintInset } = assembly;
  if (model === `recurvebow`) {
    panel(`recurve-stock`, [[-2.24, 0.21], [-1.82, 0.3], [-1.28, 0.17], [-0.61, 0.09], [-0.86, -0.08], [-1.35, -0.15], [-1.77, -0.36], [-2.18, -0.36], [-2.26, -0.16]], 0.36, paint);
    box(rubber, -2.25, -0.08, 0, 0.09, 0.54, 0.4, -0.07);
    panel(`recurve-grip`, [[-0.82, 0.01], [-0.42, -0.05], [-0.49, -0.32], [-0.68, -0.72], [-0.99, -0.66], [-0.94, -0.35]], 0.29, rubber);
    panel(`recurve-body`, [[-1.31, 0.16], [0.75, 0.19], [1.49, 0.12], [1.64, -0.04], [0.85, -0.2], [-0.47, -0.14], [-0.95, -0.07], [-1.36, -0.09]], 0.35, paint);
    box(metal, 0.08, 0.25, 0, 2.61, 0.08, 0.16);
    box(paintInset, 0.5, -0.2, 0, 0.74, 0.14, 0.3);
    box(paint, 1.24, 0.18, 0, 0.36, 0.27, 0.8);
    tube(metal, 1.47, 0.21, 0, 0.3, 0.065);
    ring(metal, -0.45, -0.27, 0, 0.19, `z`);
    box(metal, -0.44, -0.09, 0, 0.42, 0.07, 0.21);
    box(trim, -0.1, 0.38, 0, 0.57, 0.08, 0.12);
    box(metal, -0.31, 0.32, 0, 0.06, 0.17, 0.12);
    box(metal, 0.13, 0.32, 0, 0.06, 0.17, 0.12);
    for (const side of [-1, 1]) {
      custom(`recurve-limb-${side}`, () => createRecurveLimb(side), paint);
      box(trim, 0.79, 0.45, side * 2.04, 0.17, 0.08, 0.11);
      ellipsoid(metal, 1.23, 0.23, side * 0.38, 0.18, 0.13, 0.17);
      beam(trim, [0.79, 0.46, side * 2.07], [-0.25, 0.27, 0], 0.011);
      panel(`recurve-stock-inlay-${side}`, [[-2.07, 0.08], [-1.81, 0.13], [-1.39, 0.02], [-1.84, -0.2], [-2.06, -0.21]], 0.018, paintInset, side * 0.19);
      box(trim, 0.54, 0.07, side * 0.19, 0.57, 0.035, 0.02);
      cylinder(metal, 0.96, 0.01, side * 0.19, 0.047, 0.024, `z`);
    }
    return;
  }
  panel(`compound-stock`, [[-2.11, 0.17], [-1.68, 0.2], [-1.05, 0.07], [-0.7, -0.04], [-0.92, -0.18], [-1.47, -0.2], [-1.86, -0.43], [-2.17, -0.38]], 0.32, paint);
  box(rubber, -2.15, -0.1, 0, 0.1, 0.6, 0.37, -0.09);
  panel(`compound-grip`, [[-0.79, -0.04], [-0.42, -0.06], [-0.37, -0.3], [-0.61, -0.8], [-0.9, -0.72], [-0.92, -0.37]], 0.27, rubber);
  panel(`compound-body`, [[-1.07, 0.15], [0.68, 0.2], [1.39, 0.1], [1.55, -0.1], [1.06, -0.26], [0.29, -0.28], [-0.22, -0.14], [-0.98, -0.08]], 0.42, paint);
  box(metal, 0.17, 0.27, 0, 2.51, 0.075, 0.14);
  box(paintInset, 0.43, -0.25, 0, 0.73, 0.19, 0.34);
  box(paint, 0.98, 0.15, 0, 0.35, 0.34, 0.94);
  box(metal, -0.51, -0.11, 0, 0.47, 0.08, 0.19);
  ring(metal, -0.5, -0.3, 0, 0.2, `z`);
  if (optic === `precision`) {
    tube(metal, -0.25, 0.54, 0, 0.8, 0.1);
    cylinder(lens, 0.17, 0.54, 0, 0.078, 0.018, `x`);
    cylinder(lens, -0.68, 0.54, 0, 0.078, 0.018, `x`);
    box(metal, -0.5, 0.38, 0, 0.09, 0.17, 0.15);
    box(metal, -0.04, 0.38, 0, 0.09, 0.17, 0.15);
  }
  for (const side of [-1, 1]) {
    beam(paint, [0.97, 0.23, side * 0.35], [1.27, 0.38, side * 1.69], 0.1);
    beam(paint, [0.97, 0.03, side * 0.35], [1.27, 0.18, side * 1.69], 0.09);
    beam(paintInset, [1.08, 0.25, side * 0.85], [1.22, 0.3, side * 1.48], 0.04);
    const wheelX = 1.22;
    const wheelY = 0.29;
    const wheelZ = side * 1.84;
    cylinder(paintInset, wheelX, wheelY, wheelZ, 0.25, 0.08, `y`);
    ring(metal, wheelX, wheelY + 0.055, wheelZ, 0.26, `y`);
    ring(trim, wheelX, wheelY - 0.055, wheelZ, 0.26, `y`);
    cylinder(metal, wheelX, wheelY, wheelZ, 0.07, 0.15, `y`);
    for (let spoke = 0; spoke < 4; spoke += 1) {
      const angle = spoke * Math.PI / 2 + 0.3;
      beam(metal, [wheelX, wheelY + 0.07, wheelZ], [wheelX + Math.cos(angle) * 0.22, wheelY + 0.07, wheelZ + Math.sin(angle) * 0.22], 0.016);
    }
    beam(trim, [0.98, 0.32, wheelZ], [-0.17, 0.29, 0], 0.01);
    beam(rubber, [1.44, 0.22, wheelZ], [0.42, 0.15, -wheelZ * 0.7], 0.009);
    panel(`compound-stock-inlay-${side}`, [[-1.98, 0.04], [-1.68, 0.06], [-1.2, -0.07], [-1.58, -0.1], [-1.95, -0.28]], 0.018, paintInset, side * 0.17);
    box(trim, 0.39, 0.08, side * 0.23, 0.66, 0.038, 0.02);
    cylinder(metal, 0.99, 0.04, side * 0.49, 0.055, 0.03, `z`);
  }
};
