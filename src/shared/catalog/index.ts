import { sampleWeapons } from './samples';
import { weaponFinishes } from './finishes';
import { optics, attachments } from './equipment';
import { catalogSamplesEnabled } from '../config';
import type { SkinId, Category, Weapon } from '../../types/types';

export { isSkinId } from './finishes';
export const defaultWeaponId = `arx-27`;
const legacyWeaponFinishes = new Map<string, SkinId>([[`arx-27-silver`, `silver`], [`arx-27-graphite`, `graphite`]]);
export const resolveWeaponId = (id: string): string => legacyWeaponFinishes.has(id) ? defaultWeaponId : id;
export const categories: { id: Category; label: string; subtitle?: string }[] = [
  { id: `all`, label: `All Weapons` },
  { id: `firearms`, label: `Firearms`, subtitle: `Rifles / Sidearms` },
  { id: `swords`, label: `Swords`, subtitle: `Blades / Heritage` },
  { id: `crossbows`, label: `Crossbows`, subtitle: `Recurve / Compound` },
  { id: `drones`, label: `Drones`, subtitle: `Air / Autonomous` },
  { id: `future`, label: `Future`, subtitle: `Research / Systems` },
];
export const skins = weaponFinishes;
export { optics, attachments, customizations, isOpticId, isAttachmentId, isCustomizationId, getEquipmentOptions, getEquipmentDefaults, getEffectiveEquipment, getEquipmentSummary } from './equipment';
export const CATEGORIES = categories;
export const SKINS = skins;
export const OPTICS = optics;
export const ATTACHMENTS = attachments;
export const getCatalogWeapons = (): Weapon[] => catalogSamplesEnabled ? sampleWeapons.map(weapon => ({ ...weapon, stats: weapon.stats.map(stat => ({ ...stat })) })) : [];
export const getCatalogWeapon = (id: string): Weapon | null => {
  const weapon = getCatalogWeapons().find(item => item.id === resolveWeaponId(id));
  const legacyFinish = legacyWeaponFinishes.get(id);
  return weapon && legacyFinish ? { ...weapon, defaultSkin: legacyFinish } : weapon ?? null;
};
export type { Weapon, Category, LoadoutDraft, SkinId, OpticId, AttachmentId } from '../../types/types';

