import type { SkinId } from '../../types/types';

export type WeaponFinish = {
  id: SkinId;
  label: string;
  color: string;
  swatch: string;
  palette?: readonly string[];
  pattern?: `blotches` | `digital` | `stripes`;
};

const camouflage = (id: SkinId, label: string, pattern: NonNullable<WeaponFinish[`pattern`]>, palette: readonly [string, string, string, string]): WeaponFinish => {
  const swatch = pattern === `digital`
    ? `repeating-conic-gradient(${palette[1]} 0% 25%, ${palette[0]} 0% 50%) 0 0 / 6px 6px`
    : pattern === `stripes`
      ? `repeating-linear-gradient(132deg, ${palette[0]} 0 7px, ${palette[1]} 7px 11px, ${palette[2]} 11px 14px)`
      : `radial-gradient(ellipse at 20% 30%, ${palette[1]} 0 25%, transparent 26%), radial-gradient(ellipse at 80% 70%, ${palette[2]} 0 30%, transparent 31%), ${palette[0]}`;
  return { id, label, color: palette[0], swatch, pattern, palette };
};

export const weaponFinishes: readonly WeaponFinish[] = [
  { id: `olive`, label: `Olive`, color: `#375540`, swatch: `#375540` },
  { id: `silver`, label: `Silver`, color: `#859398`, swatch: `#859398` },
  { id: `graphite`, label: `Graphite`, color: `#17181a`, swatch: `#17181a` },
  camouflage(`desert`, `Desert Camo`, `blotches`, [`#c8ad79`, `#a1855d`, `#e4d4af`, `#705b41`]),
  camouflage(`woodland`, `Woodland Camo`, `blotches`, [`#526445`, `#28372c`, `#9a9970`, `#463b2e`]),
  camouflage(`arctic`, `Arctic Camo`, `blotches`, [`#e1e5e6`, `#aab5bf`, `#f8f8f3`, `#6c7d89`]),
  camouflage(`urban`, `Urban Camo`, `blotches`, [`#647078`, `#2e363e`, `#a5afb5`, `#434d54`]),
  camouflage(`digital`, `Digital Camo`, `digital`, [`#6b7659`, `#303c31`, `#a2a88c`, `#505840`]),
  camouflage(`tiger`, `Tiger Camo`, `stripes`, [`#b28b4d`, `#262d25`, `#737848`, `#d1b57b`]),
];

export const isSkinId = (value: unknown): value is SkinId => weaponFinishes.some(finish => finish.id === value);
export type { SkinId };