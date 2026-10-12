import type { ModelAssembly } from './modelAssembly';
import { createAttachmentDetails } from './attachmentDetails';
import type { GunModelId, OpticId, AttachmentId } from '../../types/types';

type EquipmentModel = GunModelId | `recurvebow` | `compoundbow`;
type EquipmentMount = { size: number; railY: number; opticX: number; frontX: number; bottomY: number; muzzleX: number; muzzleY: number };
const equipmentMounts: Record<EquipmentModel, EquipmentMount> = {
  rifle: { size: 1.35, railY: .59, opticX: -.35, frontX: 2.45, bottomY: -.35, muzzleX: 5.05, muzzleY: .035 },
  smg: { size: .75, railY: .62, opticX: .12, frontX: .894, bottomY: .142, muzzleX: 1.58, muzzleY: .33 },
  shotgun: { size: .9, railY: .625, opticX: -.3, frontX: .98, bottomY: .11, muzzleX: 2.32, muzzleY: .42 },
  precision: { size: .95, railY: .365, opticX: -.035, frontX: 1.48, bottomY: .07, muzzleX: 2.91, muzzleY: .29 },
  marksman: { size: .95, railY: .58, opticX: -.1, frontX: 1.25, bottomY: .017, muzzleX: 2.91, muzzleY: .32 },
  pistol: { size: .6, railY: .482, opticX: -.68, frontX: .72, bottomY: .035, muzzleX: 1.08, muzzleY: .36 },
  recurvebow: { size: .8, railY: .32, opticX: -.1, frontX: .7, bottomY: -.2, muzzleX: 1.6, muzzleY: .21 },
  compoundbow: { size: .8, railY: .32, opticX: -.25, frontX: .5, bottomY: -.28, muzzleX: 1.6, muzzleY: .21 },
};

export const assembleGunEquipment = (model: EquipmentModel, optic: OpticId | null, attachment: AttachmentId, assembly: ModelAssembly, standalone = false): void => {
  const { box, tube, panel, rubber, trim, recess, anodized: metal } = assembly;
  const { glass, knurl, sleeve, window, fastener } = createAttachmentDetails(assembly);
  const { size, railY, opticX, frontX, bottomY, muzzleX, muzzleY } = equipmentMounts[model];
  const crossbow = model === `recurvebow` || model === `compoundbow`;
  if (optic === `standard` && (standalone || model === `precision` || crossbow)) {
    const rearX = opticX - .3 * size, sightX = frontX + .16 * size;
    panel(`equipment-rear-sight`, [[rearX - .09 * size, railY], [rearX + .09 * size, railY], [rearX + .065 * size, railY + .075 * size], [rearX - .065 * size, railY + .075 * size]], .24 * size, metal);
    for (const side of [-1, 1]) {
      box(metal, rearX, railY + .125 * size, side * .075 * size, .07 * size, .12 * size, .045 * size);
      fastener(rearX, railY + .045 * size, side * .13 * size, .024 * size);
    }
    panel(`equipment-front-sight`, [[sightX - .08 * size, railY], [sightX + .08 * size, railY], [sightX + .045 * size, railY + .12 * size], [sightX - .045 * size, railY + .12 * size]], .14 * size, metal);
    box(trim, sightX, railY + .14 * size, 0, .033 * size, .065 * size, .032 * size);
  }
  if (optic === `reflex`) {
    const scale = model === `rifle` ? size * 1.25 : size;
    const hoodX = opticX + .025 * scale, hoodY = railY + .43 * scale;
    panel(`equipment-reflex-body`, [[opticX - .32 * scale, railY + .065 * scale], [opticX + .27 * scale, railY + .065 * scale], [opticX + .23 * scale, railY + .21 * scale], [opticX - .24 * scale, railY + .235 * scale], [opticX - .32 * scale, railY + .18 * scale]], .43 * scale, metal);
    box(metal, opticX, railY + .035 * scale, 0, .62 * scale, .07 * scale, .48 * scale);
    for (const side of [-1, 1]) {
      box(rubber, opticX - .02 * scale, railY + .12 * scale, side * .244 * scale, .48 * scale, .07 * scale, .025 * scale);
      fastener(opticX - .19 * scale, railY + .13 * scale, side * .265 * scale, .031 * scale);
      fastener(opticX + .17 * scale, railY + .13 * scale, side * .265 * scale, .024 * scale);
    }
    const aperture: readonly (readonly [number, number])[] = [[-.185, -.195], [.185, -.195], [.208, -.14], [.208, .145], [.15, .21], [-.15, .21], [-.208, .145], [-.208, -.14]];
    window(`reflex-hood`, hoodX, hoodY, scale, [[-.25, -.24], [.25, -.24], [.265, -.17], [.265, .18], [.19, .268], [-.19, .268], [-.265, .18], [-.265, -.17]], aperture);
    window(`reflex-pane`, hoodX, hoodY, scale, aperture);
    assembly.cylinder(metal, opticX - .13 * scale, railY + .205 * scale, .26 * scale, .072 * scale, .07 * scale, `z`);
    assembly.ring(trim, opticX - .13 * scale, railY + .205 * scale, .302 * scale, .064 * scale);
    fastener(opticX - .13 * scale, railY + .205 * scale, .307 * scale, .025 * scale);
    assembly.ellipsoid(assembly.reticle, hoodX + .005 * scale, hoodY, 0, .008 * scale, .01 * scale, .01 * scale);
  }
  if (optic === `precision`) {
    const axialScale = model === `precision` ? 1.2 : 1;
    const eyepieceScale = model === `precision` ? 1.08 : 1;
    const scopeY = model === `precision` ? .61 : railY + .4 * size;
    const scopeX = (offset: number) => opticX + offset * size * axialScale;
    box(metal, scopeX(-.05), railY + .035 * size, 0, 1.05 * size * axialScale, .07 * size, .29 * size);
    tube(metal, scopeX(-.02), scopeY, 0, .98 * size * axialScale, .095 * size);
    for (const offset of [-.36, .28]) {
      const mountX = scopeX(offset);
      panel(`equipment-scope-riser:${offset}`, [[mountX - .09 * size, railY + .06 * size], [mountX + .09 * size, railY + .06 * size], [mountX + .07 * size, scopeY - .055 * size], [mountX - .07 * size, scopeY - .055 * size]], .22 * size, metal);
      sleeve(metal, mountX, scopeY, 0, .12 * size, .127 * size, .127 * size, .03 * size);
      box(metal, mountX, railY + .065 * size, 0, .23 * size, .10 * size, .36 * size);
      for (const side of [-1, 1]) {
        fastener(mountX - .066 * size, railY + .073 * size, side * .185 * size, .028 * size);
        fastener(mountX + .066 * size, railY + .073 * size, side * .185 * size, .028 * size);
        fastener(mountX, scopeY - .10 * size, side * .125 * size, .022 * size);
        box(recess, mountX, scopeY + .035 * size, side * .13 * size, .13 * size, .013 * size, .018 * size);
      }
    }
    sleeve(metal, scopeX(.475), scopeY, 0, .39 * size * axialScale, .097 * size, .185 * size, .018 * size);
    sleeve(metal, scopeX(.79), scopeY, 0, .25 * size * axialScale, .185 * size, .185 * size, .025 * size);
    assembly.ring(trim, scopeX(.886), scopeY, 0, .181 * size, `x`);
    assembly.ring(recess, scopeX(.844), scopeY, 0, .154 * size, `x`);
    glass(scopeX(.832), scopeY, 0, .152 * size);
    sleeve(metal, scopeX(-.565), scopeY, 0, .15 * size * axialScale, .127 * size * eyepieceScale, .096 * size, .017 * size);
    sleeve(metal, scopeX(-.74), scopeY, 0, .22 * size * axialScale, .127 * size * eyepieceScale, .127 * size * eyepieceScale, .018 * size);
    sleeve(rubber, scopeX(-.61), scopeY, 0, .09 * size * axialScale, .132 * size * eyepieceScale);
    knurl(scopeX(-.61), scopeY, 0, .134 * size * eyepieceScale, .057 * size * axialScale, 28);
    for (const offset of [-.838, -.68, .669]) assembly.ring(trim, scopeX(offset), scopeY, 0, (offset < 0 ? .126 * eyepieceScale : .183) * size, `x`);
    assembly.ring(recess, scopeX(-.819), scopeY, 0, .106 * size * eyepieceScale, `x`);
    glass(scopeX(-.806), scopeY, 0, .101 * size * eyepieceScale, -1);
    assembly.cylinder(metal, scopeX(-.04), scopeY + .105 * size, 0, .102 * size, .19 * size);
    assembly.cylinder(metal, scopeX(-.04), scopeY + .215 * size, 0, .112 * size, .07 * size);
    assembly.ring(trim, scopeX(-.04), scopeY + .25 * size, 0, .106 * size, `y`);
    for (let index = 0; index < 28; index += 1) {
      const angle = index * Math.PI * 2 / 28;
      box(trim, scopeX(-.04) + Math.cos(angle) * .112 * size, scopeY + .215 * size, Math.sin(angle) * .112 * size, .011 * size, .05 * size, .012 * size, 0, -angle);
    }
    for (const side of [-1, 1]) {
      assembly.cylinder(metal, scopeX(-.04), scopeY, side * .125 * size, .095 * size, .115 * size, `z`);
      assembly.ring(trim, scopeX(-.04), scopeY, side * .187 * size, .091 * size);
      fastener(scopeX(-.04), scopeY, side * .195 * size, .038 * size);
      for (let index = 0; index < 20; index += 1) {
        const angle = index * Math.PI * 2 / 20;
        box(trim, scopeX(-.04) + Math.cos(angle) * .096 * size, scopeY + Math.sin(angle) * .096 * size, side * .15 * size, .011 * size, .012 * size, .052 * size, angle);
      }
    }
  }
  if (attachment === `light`) {
    const radius = size * .11, gap = size * .065;
    const lightX = model === `marksman` ? 1.105 : frontX;
    const halfDepth = model === `rifle` ? .40 : model === `smg` ? .21 : model === `shotgun` ? .184 : model === `precision` ? .17 : model === `marksman` ? .28 : size * .24;
    const lightZ = halfDepth + radius + gap, lightY = model === `marksman` ? .303 : bottomY + .18 * size;
    box(metal, lightX, lightY, halfDepth + size * .016, size * .38, size * .14, size * .032);
    box(metal, lightX, lightY, halfDepth + gap * .5, size * .25, size * .10, gap);
    tube(metal, lightX - .04 * size, lightY, lightZ, .52 * size, radius);
    sleeve(metal, lightX + .25 * size, lightY, lightZ, .12 * size, radius, .137 * size, .019 * size);
    sleeve(metal, lightX + .345 * size, lightY, lightZ, .09 * size, .137 * size, .137 * size, .023 * size);
    glass(lightX + .347 * size, lightY, lightZ, .107 * size);
    assembly.ring(trim, lightX + .381 * size, lightY, lightZ, .129 * size, `x`);
    for (const offset of [-.20, -.15, -.10, .16, .20]) assembly.ring(recess, lightX + offset * size, lightY, lightZ, radius * 1.01, `x`);
    knurl(lightX - .175 * size, lightY, lightZ, radius * 1.045, .065 * size);
    sleeve(rubber, lightX - .31 * size, lightY, lightZ, .07 * size, .115 * size);
    tube(rubber, lightX - .346 * size, lightY, lightZ, .012 * size, .082 * size);
    for (const offset of [-.12, .12]) fastener(lightX + offset * size, lightY, halfDepth + .035 * size, .027 * size);
    assembly.ellipsoid(rubber, lightX - .07 * size, lightY + radius + .012 * size, lightZ, .045 * size, .018 * size, .033 * size);
  }
  if (attachment === `bipod` && model !== `pistol`) {
    const angledLegs = model === `precision` || model === `marksman`;
    const legScale = angledLegs ? .73 : 1;
    box(metal, frontX, bottomY - .04 * size, 0, .27 * size, .08 * size, .34 * size);
    for (const side of [-1, 1]) {
      const start: readonly [number, number, number] = [frontX, bottomY - .15 * size, side * .12 * size];
      const collar: readonly [number, number, number] = [frontX + (angledLegs ? side * .17 : .055) * size, bottomY - .68 * size * legScale, side * .32 * size];
      const end: readonly [number, number, number] = [frontX + (angledLegs ? side * .30 : .08) * size, bottomY - .93 * size * legScale, side * .41 * size];
      for (const offset of [-.058, .058]) box(metal, frontX + offset * size, bottomY - .11 * size, side * .12 * size, .037 * size, .17 * size, .15 * size);
      tube(metal, frontX, bottomY - .14 * size, side * .12 * size, .17 * size, .061 * size);
      assembly.ring(trim, frontX + .088 * size, bottomY - .14 * size, side * .12 * size, .046 * size, `x`);
      assembly.beam(metal, start, collar, .045 * size);
      assembly.beam(trim, collar, end, .028 * size);
      for (const fraction of [.72, .78, .85, .91]) {
        const x = start[0] + (end[0] - start[0]) * fraction;
        const y = start[1] + (end[1] - start[1]) * fraction;
        const z = start[2] + (end[2] - start[2]) * fraction;
        assembly.beam(rubber, [x - .003 * size, y + .023 * size, z - side * .009 * size], [x + .003 * size, y - .023 * size, z + side * .009 * size], .048 * size);
      }
      assembly.ellipsoid(rubber, end[0] + .008 * size, end[1] - .017 * size, end[2], .097 * size, .035 * size, .069 * size);
      fastener(frontX - .074 * size, bottomY - .052 * size, side * .18 * size, .025 * size);
    }
  }
  if (attachment === `grip` && model !== `pistol`) {
    box(metal, frontX, bottomY - .035 * size, 0, .31 * size, .07 * size, .28 * size);
    panel(`equipment-foregrip`, [[frontX - .09 * size, bottomY - .07 * size], [frontX + .085 * size, bottomY - .07 * size], [frontX + .062 * size, bottomY - .48 * size], [frontX + .012 * size, bottomY - .55 * size], [frontX - .105 * size, bottomY - .525 * size], [frontX - .115 * size, bottomY - .17 * size]], .19 * size, rubber);
    for (const side of [-1, 1]) {
      panel(`equipment-grip-insert`, [[frontX - .075 * size, bottomY - .15 * size], [frontX + .058 * size, bottomY - .15 * size], [frontX + .04 * size, bottomY - .45 * size], [frontX - .07 * size, bottomY - .48 * size]], .014 * size, metal, side * .105 * size);
      fastener(frontX - .075 * size, bottomY - .034 * size, side * .151 * size, .025 * size);
      for (let index = 0; index < 13; index += 1) box(recess, frontX - .012 * size, bottomY - (.17 + index * .021) * size, side * .121 * size, .128 * size, .009 * size, .009 * size, -.07);
    }
    box(metal, frontX - .02 * size, bottomY - .525 * size, 0, .145 * size, .035 * size, .21 * size);
  }
  if (attachment === `suppressor` && !crossbow) {
    const extensionSize = model === `pistol` ? .85 : size;
    const centerX = muzzleX + .42 * extensionSize;
    sleeve(metal, muzzleX + .075 * extensionSize, muzzleY, 0, .15 * extensionSize, .10 * extensionSize);
    sleeve(metal, centerX, muzzleY, 0, .69 * extensionSize, .113 * extensionSize, .113 * extensionSize, .017 * extensionSize);
    sleeve(metal, muzzleX + .80 * extensionSize, muzzleY, 0, .07 * extensionSize, .112 * extensionSize, .10 * extensionSize, .035 * extensionSize);
    assembly.ring(trim, muzzleX + .82 * extensionSize, muzzleY, 0, .093 * extensionSize, `x`);
    for (const offset of [.12, .16, .63, .69]) assembly.ring(recess, muzzleX + offset * extensionSize, muzzleY, 0, .112 * extensionSize, `x`);
    knurl(muzzleX + .19 * extensionSize, muzzleY, 0, .115 * extensionSize, .063 * extensionSize);
    for (let index = 0; index < 12; index += 1) {
      const angle = index * Math.PI * 2 / 12;
      box(recess, centerX + .025 * extensionSize, muzzleY + Math.cos(angle) * .113 * extensionSize, Math.sin(angle) * .113 * extensionSize, .36 * extensionSize, .003 * extensionSize, .008 * extensionSize, 0, 0, angle);
    }
  }
};
