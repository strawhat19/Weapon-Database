import type { ModelAssembly } from './modelAssembly';
import { createAttachmentDetails } from './attachmentDetails';
import type { StockId, MuzzleId, MagazineId, GunModelId } from '../../types/types';

type Vector = readonly [number, number, number];
type GunModLayout = {
  size: number;
  muzzle: readonly [number, number];
  cheek?: { center: Vector; dimensions: Vector };
  magazine?: { start: Vector; width: number; depth: number; length: number; angle?: number };
};
const layouts: Record<GunModelId, GunModLayout> = {
  rifle: { size: 1.35, muzzle: [5.05, .035], cheek: { center: [-3.9, .65, 0], dimensions: [1.2, .20, .50] }, magazine: { start: [-.30, -2.16, 0], width: .75, depth: .42, length: .45, angle: .08 } },
  smg: { size: .75, muzzle: [1.58, .33], cheek: { center: [-1.45, .61, 0], dimensions: [.82, .14, .33] }, magazine: { start: [.362, -.83, 0], width: .287, depth: .281, length: .35, angle: .154 } },
  shotgun: { size: .9, muzzle: [2.32, .42], cheek: { center: [-1.6, .41, 0], dimensions: [.72, .15, .32] } },
  precision: { size: .95, muzzle: [2.91, .29], cheek: { center: [-1.37, .365, 0], dimensions: [.66, .10, .37] }, magazine: { start: [.055, -.325, 0], width: .415, depth: .3, length: .23 } },
  marksman: { size: .95, muzzle: [2.91, .32], cheek: { center: [-1.76, .62, 0], dimensions: [.58, .10, .39] }, magazine: { start: [.304, -.648, 0], width: .375, depth: .286, length: .27 } },
  pistol: { size: .6, muzzle: [1.08, .36], magazine: { start: [-.699, -.729, 0], width: .478, depth: .35, length: .20, angle: -.11 } },
};
export const assembleGunMods = (model: GunModelId, stock: StockId, magazine: MagazineId, muzzle: MuzzleId, assembly: ModelAssembly) => {
  const layout = layouts[model];
  const { metal, rubber, trim, recess } = assembly;
  const { sleeve, fastener } = createAttachmentDetails(assembly);
  if (stock === `cheek-rest` && layout.cheek) {
    const [x, y, z] = layout.cheek.center;
    const [width, height, depth] = layout.cheek.dimensions;
    assembly.panel(`${model}-cheek-rest`, [[x - width * .5, y - height * .5], [x - width * .45, y + height * .35], [x - width * .34, y + height * .5], [x + width * .35, y + height * .5], [x + width * .46, y + height * .28], [x + width * .5, y - height * .5]], depth, rubber, z);
    for (const offset of [-.3, .3]) {
      assembly.box(metal, x + offset * width, y - height * .5 - .04, z, width * .07, .08, depth * .58);
      for (const side of [-1, 1]) fastener(x + offset * width, y - height * .40, z + side * (depth * .5 + .012), height * .11);
    }
    for (const side of [-1, 1]) {
      assembly.panel(`${model}-cheek-inset`, [[x - width * .33, y - height * .13], [x + width * .31, y - height * .13], [x + width * .25, y + height * .20], [x - width * .26, y + height * .20]], .012, metal, z + side * (depth * .5 + .008));
      for (let index = 0; index < 15; index += 1) assembly.box(rubber, x - width * .25 + index * width * .036, y + height * .04, z + side * (depth * .5 + .018), width * .008, height * .24, .01);
    }
  }
  if (magazine === `extended` && layout.magazine) {
    const { start, width, depth, length, angle = 0 } = layout.magazine;
    const [x, y, z] = start;
    const sine = Math.sin(angle), cosine = Math.cos(angle);
    const magazinePoint = (horizontal: number, vertical: number): readonly [number, number] => [x + cosine * horizontal - sine * vertical, y + sine * horizontal + cosine * vertical];
    assembly.panel(`${model}-extended-magazine`, [magazinePoint(-width * .4, 0), magazinePoint(width * .4, 0), magazinePoint(width * .4, -length * .88), magazinePoint(width * .3, -length), magazinePoint(-width * .3, -length), magazinePoint(-width * .4, -length * .9)], depth * .86, metal, z);
    assembly.box(rubber, x + sine * (length + .035), y - cosine * (length + .035), z, width, .09, depth, angle);
    for (const side of [-1, 1]) {
      const surfaceZ = z + side * (depth * .43 + .008);
      for (const fraction of [.12, .52, .90]) assembly.box(trim, x + sine * length * fraction, y - cosine * length * fraction, surfaceZ, width * .66, .018, .016, angle);
      for (const offset of [-.24, 0, .24]) {
        assembly.box(recess, x + cosine * width * offset + sine * length * .5, y + sine * width * offset - cosine * length * .5, surfaceZ + side * .009, width * .12, length * .67, .012, angle);
      }
      assembly.box(metal, x + sine * (length + .026), y - cosine * (length + .026), z + side * (depth * .5 + .008), width * .63, .022, .012, angle);
    }
  }
  if (muzzle === `brake`) {
    const { size } = layout;
    const [x, y] = layout.muzzle;
    const radius = size * .145, frontX = x + size * .55;
    sleeve(metal, x + size * .055, y, 0, size * .11, size * .118, radius, size * .029);
    sleeve(metal, x + size * .32, y, 0, size * .46, radius, radius, size * .042);
    sleeve(metal, frontX + size * .014, y, 0, size * .035, radius, radius * .92, size * .065);
    assembly.ring(trim, frontX + size * .032, y, 0, radius * .91, `x`);
    for (const offset of [.12, .47]) assembly.ring(trim, x + size * offset, y, 0, radius * .99, `x`);
    for (const side of [-1, 1]) for (const offset of [.23, .37]) {
      assembly.panel(`muzzle-exterior-slot:${side}:${offset}`, [[x + size * (offset - .04), y - size * .045], [x + size * (offset + .04), y - size * .045], [x + size * (offset + .052), y + size * .027], [x + size * (offset - .052), y + size * .027]], size * .013, recess, side * radius);
    }
  }
};
