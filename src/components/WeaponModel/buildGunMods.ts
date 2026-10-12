import type { ModelAssembly } from './modelAssembly';
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
  smg: { size: .75, muzzle: [1.58, .33], cheek: { center: [-1.5, .66, 0], dimensions: [.82, .16, .34] }, magazine: { start: [.15, -.85, 0], width: .38, depth: .33, length: .45 } },
  shotgun: { size: .9, muzzle: [2.32, .42], cheek: { center: [-1.6, .52, 0], dimensions: [.72, .15, .32] } },
  precision: { size: .95, muzzle: [2.91, .29], cheek: { center: [-1.6, .68, 0], dimensions: [.75, .16, .34] }, magazine: { start: [.13, -.575, 0], width: .42, depth: .36, length: .30 } },
  pistol: { size: .6, muzzle: [1.08, .5], magazine: { start: [-.65, -1, 0], width: .42, depth: .36, length: .22 } },
};
export const assembleGunMods = (model: GunModelId, stock: StockId, magazine: MagazineId, muzzle: MuzzleId, assembly: ModelAssembly) => {
  const layout = layouts[model];
  const { metal, rubber, trim, paintInset } = assembly;
  if (stock === `cheek-rest` && layout.cheek) {
    const [x, y, z] = layout.cheek.center;
    const [width, height, depth] = layout.cheek.dimensions;
    assembly.panel(`${model}-cheek-rest`, [[x - width * .5, y - height * .5], [x - width * .42, y + height * .5], [x + width * .38, y + height * .5], [x + width * .5, y - height * .5]], depth, rubber, z);
    for (const side of [-1, 1]) {
      assembly.box(metal, x + side * width * .3, y - height * .5 - .04, z, width * .06, .08, depth * .58);
      assembly.box(trim, x, y, z + side * (depth * .5 + .008), width * .55, height * .24, .016);
    }
  }
  if (magazine === `extended` && layout.magazine) {
    const { start, width, depth, length, angle = 0 } = layout.magazine;
    const [x, y, z] = start;
    const sine = Math.sin(angle), cosine = Math.cos(angle);
    assembly.box(paintInset, x + sine * length * .5, y - cosine * length * .5, z, width * .8, length, depth * .86, angle);
    assembly.box(rubber, x + sine * (length + .035), y - cosine * (length + .035), z, width, .09, depth, angle);
    for (const side of [-1, 1]) for (const fraction of [.3, .65]) {
      assembly.box(metal, x + sine * length * fraction, y - cosine * length * fraction, z + side * (depth * .43 + .008), width * .62, .025, .016, angle);
    }
  }
  if (muzzle === `brake`) {
    const { size } = layout;
    const [x, y] = layout.muzzle;
    const radius = size * .155, frontX = x + size * .55;
    assembly.tube(metal, x + size * .055, y, 0, size * .11, size * .135);
    assembly.tube(paintInset, x + size * .32, y, 0, size * .46, radius);
    assembly.cylinder(rubber, frontX + size * .018, y, 0, size * .105, size * .016, `x`);
    assembly.ring(trim, frontX + size * .035, y, 0, size * .16, `x`);
    for (const side of [-1, 1]) for (const offset of [.23, .41]) assembly.box(rubber, x + size * offset, y, side * radius, size * .10, size * .07, size * .016);
  }
};
