import { sampleWeapons } from './samples';
import { weaponFinishes } from './finishes';
import { optics, attachments } from './equipment';
import { catalogSamplesEnabled } from '../config';
import type { Category, Weapon } from '../../types/types';

export { isSkinId } from './finishes';
export const defaultWeaponId = `arx-27`;
export const categories: { id: Category; label: string }[] = [
  { id: `all`, label: `All Weapons` },
  { id: `firearms`, label: `Firearms` },
  { id: `swords`, label: `Swords` },
  { id: `crossbows`, label: `Crossbows` },
  { id: `drones`, label: `Drones` },
  { id: `future`, label: `Future Tech` },
];
export const skins = weaponFinishes;
export { optics, attachments, customizations, isOpticId, isAttachmentId, isCustomizationId, getEquipmentOptions, getEquipmentDefaults, getEffectiveEquipment, getEquipmentSummary } from './equipment';
export const CATEGORIES = categories;
export const SKINS = skins;
export const OPTICS = optics;
export const ATTACHMENTS = attachments;
export const getCatalogWeapons = (): Weapon[] => catalogSamplesEnabled ? sampleWeapons.map(weapon => ({ ...weapon, stats: weapon.stats.map(stat => ({ ...stat })) })) : [];
export type { Weapon, Category, LoadoutDraft, SkinId, OpticId, AttachmentId } from '../../types/types';

