export type ThemeMode = `dark` | `light`;
export type SkinId = `olive` | `graphite` | `silver`;
export type AttachmentId = `none` | `light` | `bipod`;
export type OpticId = `standard` | `reflex` | `precision`;
export type Category = `all` | `firearms` | `swords` | `drones` | `future`;
export type WeaponCategory = Exclude<Category, `all`>;
export type WeaponStat = { label: string; value: string };
export type Weapon = {
  id: string;
  era: string;
  tag: string;
  title: string;
  image: string;
  subtitle: string;
  featured?: boolean;
  isConcept?: boolean;
  description: string;
  stats: WeaponStat[];
  category: WeaponCategory;
  imageStyle: `cutout` | `photograph`;
};
export type DataRecord = {
  id: string;
  name: string;
  number: number;
  createdAt: string;
  updatedAt: string;
};
export type LoadoutDraft = {
  name: string;
  skin: SkinId;
  weaponId: string;
  optic: OpticId;
  attachment: AttachmentId;
};
export type SavedWeaponRecord = DataRecord & { weaponId: string };
export type LoadoutRecord = DataRecord & Omit<LoadoutDraft, `name`>;

