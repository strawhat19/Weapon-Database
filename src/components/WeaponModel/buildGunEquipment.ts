import type { ModelAssembly } from './modelAssembly';
import type { GunModelId, OpticId, AttachmentId } from '../../types/types';

type EquipmentModel = GunModelId | `recurvebow` | `compoundbow`;
type EquipmentMount = { size: number; railY: number; opticX: number; frontX: number; bottomY: number; muzzleX: number; muzzleY: number };
const equipmentMounts: Record<EquipmentModel, EquipmentMount> = {
  rifle: { size: 1.35, railY: 0.59, opticX: -0.35, frontX: 2.45, bottomY: -0.35, muzzleX: 5.05, muzzleY: 0.035 },
  smg: { size: 0.75, railY: 0.74, opticX: -0.1, frontX: 0.85, bottomY: 0.1, muzzleX: 1.58, muzzleY: 0.33 },
  shotgun: { size: 0.9, railY: 0.59, opticX: -0.3, frontX: 0.98, bottomY: 0.06, muzzleX: 2.32, muzzleY: 0.42 },
  precision: { size: 0.95, railY: 0.5, opticX: -0.06, frontX: 0.78, bottomY: -0.13, muzzleX: 2.91, muzzleY: 0.29 },
  pistol: { size: 0.6, railY: 0.72, opticX: -0.53, frontX: 0.58, bottomY: 0.04, muzzleX: 1.08, muzzleY: 0.5 },
  recurvebow: { size: 0.8, railY: 0.32, opticX: -0.1, frontX: 0.7, bottomY: -0.2, muzzleX: 1.6, muzzleY: 0.21 },
  compoundbow: { size: 0.8, railY: 0.32, opticX: -0.25, frontX: 0.5, bottomY: -0.28, muzzleX: 1.6, muzzleY: 0.21 },
};

export const assembleGunEquipment = (model: EquipmentModel, optic: OpticId | null, attachment: AttachmentId, assembly: ModelAssembly, standalone = false): void => {
  const { box, tube, panel, paint, paintInset, metal, rubber, trim, lens } = assembly;
  const { size, railY, opticX, frontX, bottomY, muzzleX, muzzleY } = equipmentMounts[model];
  const crossbow = model === `recurvebow` || model === `compoundbow`;
  if (optic === `standard` && (standalone || model === `precision` || crossbow)) {
    const rearX = opticX - 0.3 * size;
    const sightX = frontX + 0.16 * size;
    box(metal, rearX, railY + 0.025 * size, 0, 0.15 * size, 0.05 * size, 0.24 * size);
    box(metal, rearX, railY + 0.095 * size, -0.075 * size, 0.07 * size, 0.12 * size, 0.04 * size);
    box(metal, rearX, railY + 0.095 * size, 0.075 * size, 0.07 * size, 0.12 * size, 0.04 * size);
    box(metal, sightX, railY + 0.055 * size, 0, 0.11 * size, 0.11 * size, 0.12 * size);
    box(trim, sightX, railY + 0.135 * size, 0, 0.04 * size, 0.05 * size, 0.035 * size);
  }
  if (optic === `reflex`) {
    const scale = model === `rifle` ? size * 1.25 : size;
    box(metal, opticX, railY + scale * .045, 0, scale * .62, scale * .09, scale * .48);
    box(rubber, opticX - scale * .05, railY + scale * .15, 0, scale * .56, scale * .16, scale * .48);
    for (const side of [-1, 1]) {
      box(metal, opticX + scale * .025, railY + scale * .435, side * scale * .225, scale * .095, scale * .46, scale * .065, -.12);
      assembly.ellipsoid(trim, opticX - scale * .18, railY + scale * .15, side * scale * .253, scale * .026, scale * .026, scale * .018);
    }
    box(metal, opticX + scale * .053, railY + scale * .667, 0, scale * .125, scale * .072, scale * .52, -.12);
    box(lens, opticX + scale * .027, railY + scale * .435, 0, scale * .018, scale * .40, scale * .37, -.12);
    assembly.ellipsoid(assembly.reticle, opticX + scale * .05, railY + scale * .435, 0, scale * .012, scale * .015, scale * .015);
    assembly.ring(assembly.reticle, opticX + scale * .05, railY + scale * .435, 0, scale * .055, `x`);
  }
  if (optic === `precision`) {
    const scopeY = railY + 0.4 * size;
    box(metal, opticX, railY + 0.035 * size, 0, 0.95 * size, 0.07 * size, 0.25 * size);
    for (const direction of [-1, 1]) {
      const mountX = opticX + direction * 0.3 * size;
      box(metal, mountX, railY + 0.18 * size, 0, 0.12 * size, 0.29 * size, 0.14 * size);
      tube(metal, mountX, scopeY, 0, 0.08 * size, 0.105 * size);
      box(trim, mountX, railY + 0.07 * size, 0.13 * size, 0.06 * size, 0.06 * size, 0.04 * size);
    }
    tube(rubber, opticX, scopeY, 0, 1.08 * size, 0.085 * size);
    tube(paintInset, opticX + 0.52 * size, scopeY, 0, 0.27 * size, 0.135 * size);
    tube(metal, opticX + 0.64 * size, scopeY, 0, 0.035 * size, 0.14 * size);
    tube(lens, opticX + 0.663 * size, scopeY, 0, 0.012 * size, 0.121 * size);
    tube(paintInset, opticX - 0.52 * size, scopeY, 0, 0.2 * size, 0.105 * size);
    tube(trim, opticX - 0.6 * size, scopeY, 0, 0.035 * size, 0.111 * size);
    tube(lens, opticX - 0.626 * size, scopeY, 0, 0.012 * size, 0.085 * size);
    assembly.cylinder(rubber, opticX + .015 * size, scopeY + .13 * size, 0, .085 * size, .13 * size);
    assembly.ring(trim, opticX + .015 * size, scopeY + .2 * size, 0, .085 * size, `y`);
    assembly.cylinder(rubber, opticX + .015 * size, scopeY, .13 * size, .075 * size, .12 * size, `z`);
    assembly.ring(metal, opticX + .015 * size, scopeY, .195 * size, .075 * size);
    for (const offset of [-.45, -.40, -.35]) assembly.ring(rubber, opticX + offset * size, scopeY, 0, .09 * size, `x`);
  }
  if (attachment === `light`) {
    const radius = size * .11, length = size * .64, gap = size * .065;
    const halfDepth = model === `rifle` ? .40 : size * .24;
    const lightZ = halfDepth + radius + gap;
    const lightY = bottomY + .18 * size;
    box(metal, frontX, lightY, halfDepth + size * .016, size * .36, size * .14, size * .032);
    box(paintInset, frontX, lightY, halfDepth + gap * .5, size * .24, size * .10, gap);
    tube(paintInset, frontX, lightY, lightZ, length, radius);
    for (const offset of [-.16, .16]) assembly.ring(metal, frontX + size * offset, lightY, lightZ, radius * 1.04, `x`);
    assembly.cylinder(rubber, frontX - length * .5, lightY, lightZ, radius, size * .055, `x`);
    assembly.cylinder(lens, frontX + length * .5 + size * .015, lightY, lightZ, radius * .83, size * .015, `x`);
    assembly.ring(trim, frontX + length * .5 + size * .025, lightY, lightZ, radius * 1.18, `x`);
    assembly.ellipsoid(trim, frontX - size * .10, lightY + radius + size * .025, lightZ, size * .026, size * .026, size * .035);
  }
  if (attachment === `bipod` && model !== `pistol`) {
    box(metal, frontX, bottomY - 0.04 * size, 0, 0.2 * size, 0.08 * size, 0.34 * size);
    for (const direction of [-1, 1]) {
      const angle = direction * -0.27;
      const centerY = bottomY - 0.355 * size;
      const centerZ = direction * 0.155 * size;
      box(metal, frontX, centerY, centerZ, 0.055 * size, 0.65 * size, 0.055 * size, 0, 0, angle);
      box(trim, frontX, bottomY - 0.19 * size, direction * 0.11 * size, 0.08 * size, 0.12 * size, 0.08 * size);
      const footY = centerY - Math.cos(angle) * 0.325 * size;
      const footZ = centerZ - Math.sin(angle) * 0.325 * size;
      box(rubber, frontX + 0.025 * size, footY, footZ, 0.17 * size, 0.055 * size, 0.11 * size);
    }
  }
  if (attachment === `grip` && model !== `pistol`) {
    box(metal, frontX, bottomY - 0.04 * size, 0, 0.29 * size, 0.08 * size, 0.25 * size);
    panel(`equipment-foregrip`, [[frontX - 0.085 * size, bottomY - 0.08 * size], [frontX + 0.085 * size, bottomY - 0.08 * size], [frontX + 0.07 * size, bottomY - 0.47 * size], [frontX + 0.015 * size, bottomY - 0.56 * size], [frontX - 0.095 * size, bottomY - 0.53 * size], [frontX - 0.11 * size, bottomY - 0.17 * size]], 0.16 * size, rubber);
    for (const offset of [0.2, 0.28, 0.36, 0.44]) box(paintInset, frontX - 0.015 * size, bottomY - offset * size, 0, 0.17 * size, 0.02 * size, 0.18 * size);
    box(trim, frontX - 0.02 * size, bottomY - 0.52 * size, 0, 0.15 * size, 0.035 * size, 0.18 * size);
  }
  if (attachment === `suppressor` && !crossbow) {
    const extensionSize = model === `pistol` ? 0.85 : size;
    const centerX = muzzleX + 0.42 * extensionSize;
    tube(metal, muzzleX + 0.04 * extensionSize, muzzleY, 0, 0.12 * extensionSize, 0.095 * extensionSize);
    tube(paintInset, centerX, muzzleY, 0, 0.78 * extensionSize, 0.105 * extensionSize);
    tube(trim, muzzleX + 0.12 * extensionSize, muzzleY, 0, 0.035 * extensionSize, 0.111 * extensionSize);
    tube(metal, muzzleX + 0.79 * extensionSize, muzzleY, 0, 0.06 * extensionSize, 0.11 * extensionSize);
    tube(rubber, muzzleX + 0.825 * extensionSize, muzzleY, 0, 0.012 * extensionSize, 0.063 * extensionSize);
  }
};
