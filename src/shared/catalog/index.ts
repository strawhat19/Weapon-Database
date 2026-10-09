import { sampleWeapons } from './samples';
import { catalogSamplesEnabled } from '../config';
import type { Category, SkinId, OpticId, AttachmentId, Weapon } from '../../types/types';

export const defaultWeaponId = `arx-27`;
export const categories: { id: Category; label: string }[] = [
  { id: `all`, label: `All Weapons` },
  { id: `firearms`, label: `Firearms` },
  { id: `swords`, label: `Swords` },
  { id: `drones`, label: `Drones` },
  { id: `future`, label: `Future Tech` },
];
export const skins: { id: SkinId; label: string; color: string }[] = [
  { id: `olive`, label: `Olive`, color: `#3D5844` },
  { id: `graphite`, label: `Graphite`, color: `#565B64` },
  { id: `silver`, label: `Silver`, color: `#859398` },
];
export const optics: { id: OpticId; label: string }[] = [
  { id: `standard`, label: `Standard` },
  { id: `reflex`, label: `Reflex` },
  { id: `precision`, label: `Precision` },
];
export const attachments: { id: AttachmentId; label: string }[] = [
  { id: `none`, label: `None` },
  { id: `light`, label: `Light` },
  { id: `bipod`, label: `Bipod` },
];
export const CATEGORIES = categories;
export const SKINS = skins;
export const OPTICS = optics;
export const ATTACHMENTS = attachments;
export const getCatalogWeapons = (): Weapon[] => catalogSamplesEnabled ? sampleWeapons.map(weapon => ({ ...weapon, stats: weapon.stats.map(stat => ({ ...stat })) })) : [];
export type { Weapon, Category, LoadoutDraft, SkinId, OpticId, AttachmentId } from '../../types/types';

