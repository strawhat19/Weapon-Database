import type { ModelAssembly } from './modelAssembly';
import type { WeaponModelId, CustomizationId } from '../../types/types';
import { assembleMedievalSwordDecoration } from './buildMedievalSword';

export const assembleDisplayEquipment = (model: WeaponModelId, option: CustomizationId, assembly: ModelAssembly): void => {
  if (option === `none`) return;
  if (model === `greatsword` || model === `falchion`) {
    assembleMedievalSwordDecoration(model, option, assembly);
    return;
  }
  const { box, beam, ring, panel, cylinder, ellipsoid } = assembly;
  const { paint, paintInset, metal, rubber, trim, lens } = assembly;
  const sword = model === `longsword` || model === `katana` || model === `saber`;
  const drone = model === `quadcopter` || model === `fixedwing`;
  if (sword) {
    const guardX = model === `katana` ? -1.14 : model === `saber` ? -1.05 : -0.94;
    const pommelX = model === `katana` ? -2.47 : model === `saber` ? -2.18 : -2.39;
    if (option === `scabbard`) {
      const curve: readonly (readonly [number, number])[] = model === `katana`
        ? [[-0.96, -0.90], [-0.27, -0.91], [0.54, -0.80], [1.32, -0.59], [2.08, -0.35], [2.64, -0.18]]
        : model === `saber`
          ? [[-0.90, -0.91], [-0.09, -0.91], [0.77, -0.74], [1.52, -0.40], [2.14, -0.14], [2.65, 0.13]]
          : [[-0.83, -0.63], [0.15, -0.63], [1.25, -0.63], [2.38, -0.63], [2.65, -0.63]];
      const outline: [number, number][] = [];
      curve.forEach(([x, y]) => outline.push([x, y + 0.12]));
      const tip = curve[curve.length - 1];
      outline.push([tip[0] + 0.11, tip[1]]);
      [...curve].reverse().forEach(([x, y]) => outline.push([x, y - 0.12]));
      panel(`${model}-display-scabbard`, outline, 0.18, paint, 0.28);
      [0, Math.floor(curve.length / 2), curve.length - 1].forEach(index => {
        const point = curve[index];
        const next = curve[Math.min(index + 1, curve.length - 1)];
        const previous = curve[Math.max(0, index - 1)];
        const angle = Math.atan2(next[1] - previous[1], next[0] - previous[0]);
        box(trim, point[0], point[1], 0.28, index === 0 ? 0.13 : 0.09, 0.29, 0.23, angle);
      });
      const mouth = curve[0];
      box(paintInset, mouth[0] - 0.055, mouth[1], 0.28, 0.055, 0.23, 0.19);
      ring(metal, mouth[0] + 0.26, mouth[1] + 0.16, 0.30, 0.095, `z`);
      return;
    }
    if (option === `tassel`) {
      const knotX = pommelX - 0.14;
      beam(trim, [pommelX, -0.01, 0.06], [knotX, -0.27, 0.13], 0.028);
      ellipsoid(paint, knotX, -0.30, 0.13, 0.09, 0.105, 0.09);
      ring(trim, knotX, -0.30, 0.13, 0.095, `y`);
      for (let index = 0; index < 7; index += 1) {
        const spread = (index - 3) * 0.037;
        const depth = 0.13 + (index % 3 - 1) * 0.035;
        const material = index % 3 === 0 ? trim : index % 3 === 1 ? paint : paintInset;
        const start: [number, number, number] = [knotX + spread * 0.3, -0.38, depth];
        const bend: [number, number, number] = [knotX + spread - 0.055, -0.63, depth + 0.025];
        const end: [number, number, number] = [knotX + spread + 0.045, -0.86 - Math.abs(spread) * 0.25, depth];
        beam(material, start, bend, 0.015);
        beam(material, bend, end, 0.015);
      }
      return;
    }
    if (option === `ornate-guard`) {
      panel(`${model}-ornate-guard-plate`, [[guardX - 0.25, 0], [guardX - 0.11, 0.22], [guardX + 0.16, 0.12], [guardX + 0.20, 0], [guardX + 0.16, -0.12], [guardX - 0.11, -0.22]], 0.065, trim, 0.16);
      for (const side of [-1, 1]) {
        const curl: readonly (readonly [number, number, number])[] = [[guardX - 0.14, side * 0.17, 0.18], [guardX + 0.09, side * 0.35, 0.18], [guardX + 0.06, side * 0.60, 0.18], [guardX - 0.13, side * 0.70, 0.18], [guardX - 0.28, side * 0.61, 0.18], [guardX - 0.25, side * 0.48, 0.18]];
        for (let index = 1; index < curl.length; index += 1) beam(trim, curl[index - 1], curl[index], 0.038);
        const end = curl[curl.length - 1];
        ellipsoid(trim, end[0], end[1], end[2], 0.065, 0.065, 0.055);
      }
      ring(metal, guardX - 0.045, 0, 0.205, 0.145, `z`);
      ellipsoid(lens, guardX - 0.045, 0, 0.205, 0.105, 0.13, 0.07);
    }
    return;
  }
  if (!drone) return;
  const fixedWing = model === `fixedwing`;
  if (option === `camera`) {
    const cameraX = fixedWing ? 1.10 : 0.55;
    box(paint, cameraX, -0.285, 0, 0.22, 0.17, 0.24);
    for (const side of [-1, 1]) {
      beam(metal, [cameraX, -0.35, side * 0.18], [cameraX, -0.55, side * 0.18], 0.025);
      cylinder(trim, cameraX, -0.55, side * 0.19, 0.052, 0.055, `z`);
    }
    ellipsoid(metal, cameraX, -0.565, 0, 0.205, 0.17, 0.185);
    cylinder(paintInset, cameraX + 0.185, -0.565, 0, 0.12, 0.085, `x`);
    ring(trim, cameraX + 0.23, -0.565, 0, 0.115, `x`);
    cylinder(lens, cameraX + 0.237, -0.565, 0, 0.09, 0.018, `x`);
    return;
  }
  if (option === `cargo`) {
    const cargoX = fixedWing ? -0.15 : 0;
    const anchorY = fixedWing ? -0.17 : -0.12;
    for (const side of [-1, 1]) beam(metal, [cargoX, anchorY, side * 0.25], [cargoX, -0.34, side * 0.25], 0.035);
    box(paint, cargoX, -0.51, 0, 0.82, 0.36, 0.64);
    box(paintInset, cargoX, -0.315, 0, 0.86, 0.055, 0.68);
    for (const side of [-1, 1]) {
      box(metal, cargoX + side * 0.25, -0.51, 0, 0.048, 0.39, 0.67);
      box(trim, cargoX, -0.43, side * 0.355, 0.24, 0.055, 0.045);
    }
    box(trim, cargoX + 0.425, -0.49, 0, 0.035, 0.10, 0.13);
    return;
  }
  if (option !== `landing-kit`) return;
  if (fixedWing) {
    for (const side of [-1, 1]) {
      beam(paintInset, [0.30, -0.14, side * 0.23], [0.65, -0.73, side * 0.60], 0.045);
      box(paint, 0.65, -0.77, side * 0.60, 0.84, 0.085, 0.16);
      box(rubber, 0.65, -0.83, side * 0.60, 0.88, 0.045, 0.18);
    }
    beam(metal, [-1.0, -0.12, 0], [-1.30, -0.73, 0], 0.038);
    box(paint, -1.30, -0.77, 0, 0.56, 0.075, 0.15);
    box(rubber, -1.30, -0.825, 0, 0.60, 0.045, 0.17);
    return;
  }
  for (const side of [-1, 1]) {
    for (const front of [-1, 1]) beam(paintInset, [front * 0.45, -0.16, side * 0.26], [front * 0.70, -0.73, side * 0.53], 0.045);
    box(paint, 0, -0.775, side * 0.53, 1.75, 0.085, 0.16);
    box(rubber, 0, -0.835, side * 0.53, 1.80, 0.045, 0.18);
    box(trim, 0, -0.775, side * 0.53, 0.21, 0.105, 0.19);
  }
};

