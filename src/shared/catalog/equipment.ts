import type { OpticId, AttachmentId, CustomizationId, ModelEquipment, WeaponModelId, EquipmentSelections, EquipmentSlot, EquipmentOption, GunsmithSlot } from '../../types/types';

export const optics = [
  { id: `standard`, label: `Iron Sights`, illustration: `iron`, description: `Original open sight configuration` },
  { id: `reflex`, label: `Reflex Sight`, illustration: `reflex`, description: `Open frame, glass window and illuminated dot` },
  { id: `precision`, label: `Precision Scope`, illustration: `scope`, description: `Magnified scope with lens, mounts and turrets` },
] as const;
export const attachments = [
  { id: `none`, label: `No Attachment` },
  { id: `light`, label: `Rail Light` },
  { id: `bipod`, label: `Bipod` },
  { id: `grip`, label: `Foregrip` },
  { id: `suppressor`, label: `Suppressor` },
] as const;
export const customizations = [
  { id: `none`, label: `No Add-On`, illustration: `none`, description: `Keep the original presentation` },
  { id: `scabbard`, label: `Scabbard`, illustration: `scabbard`, description: `Matching sheath displayed beside the blade` },
  { id: `tassel`, label: `Pommel Tassel`, illustration: `tassel`, description: `Cord and decorative strands at the pommel` },
  { id: `ornate-guard`, label: `Ornate Guard`, illustration: `guard`, description: `Sculpted metalwork around the existing guard` },
  { id: `camera`, label: `Camera Pod`, illustration: `camera`, description: `Visible underslung camera and lens` },
  { id: `cargo`, label: `Cargo Case`, illustration: `cargo`, description: `Mounted case with retaining straps` },
  { id: `landing-kit`, label: `Landing Kit`, illustration: `landing`, description: `Extended landing supports and skids` },
] as const;
const muzzleOptions = [
  { id: `none`, label: `Factory Muzzle`, illustration: `none`, description: `Keep the original barrel end` },
  { id: `suppressor`, label: `Suppressor`, illustration: `suppressor`, description: `Long cylindrical muzzle attachment` },
  { id: `brake`, label: `Muzzle Brake`, illustration: `brake`, description: `Short ported muzzle attachment` },
] as const;
const underbarrelOptions = [
  { id: `none`, label: `Empty Underbarrel`, illustration: `none`, description: `Leave the lower mounting point clear` },
  { id: `grip`, label: `Foregrip`, illustration: `grip`, description: `Ribbed vertical grip beneath the handguard` },
  { id: `bipod`, label: `Bipod`, illustration: `bipod`, description: `Two deployed legs with rubber feet` },
] as const;
const railOptions = [
  { id: `none`, label: `Empty Side Rail`, illustration: `none`, description: `Leave the side mounting point clear` },
  { id: `light`, label: `Rail Light`, illustration: `light`, description: `Side mounted light with a glass lens` },
] as const;
const stockOptions = [
  { id: `none`, label: `Factory Stock`, illustration: `none`, description: `Keep the original stock profile` },
  { id: `cheek-rest`, label: `Raised Cheek Rest`, illustration: `stock`, description: `Padded stock riser with mounting brackets` },
] as const;
const magazineOptions = [
  { id: `standard`, label: `Factory Magazine`, illustration: `none`, description: `Keep the original magazine profile` },
  { id: `extended`, label: `Extended Magazine`, illustration: `magazine`, description: `Extended lower body with a rubber base plate` },
] as const;
const slotOptions: Record<EquipmentSlot, readonly EquipmentOption[]> = {
  optic: optics, rail: railOptions, stock: stockOptions, muzzle: muzzleOptions,
  magazine: magazineOptions, underbarrel: underbarrelOptions, customization: customizations,
};
export const isOpticId = (value: unknown): value is OpticId => optics.some(option => option.id === value);
export const isAttachmentId = (value: unknown): value is AttachmentId => attachments.some(option => option.id === value);
export const isCustomizationId = (value: unknown): value is CustomizationId => customizations.some(option => option.id === value);
export const isEquipmentSlotValue = (slot: EquipmentSlot, value: unknown) => slotOptions[slot].some(option => option.id === value);
export const equipmentSlots: readonly EquipmentSlot[] = [`optic`, `muzzle`, `underbarrel`, `rail`, `stock`, `magazine`, `customization`];
export const validOptionalSlots = (value: Record<string, unknown>) => equipmentSlots.filter(slot => slot !== `optic`).every(slot => value[slot] === undefined || isEquipmentSlotValue(slot, value[slot]));
export const getStoredEquipment = (equipment: Partial<EquipmentSelections>): ModelEquipment => ({
  optic: equipment.optic ?? `standard`,
  stock: equipment.stock ?? `none`,
  magazine: equipment.magazine ?? `standard`,
  attachment: equipment.attachment ?? `none`,
  customization: equipment.customization ?? `none`,
  rail: equipment.rail ?? (equipment.attachment === `light` ? `light` : `none`),
  muzzle: equipment.muzzle ?? (equipment.attachment === `suppressor` ? `suppressor` : `none`),
  underbarrel: equipment.underbarrel ?? (equipment.attachment === `grip` || equipment.attachment === `bipod` ? equipment.attachment : `none`),
});
export const getEquipmentDefaults = (model?: WeaponModelId): ModelEquipment => getStoredEquipment({
  attachment: model === `precision` || model === `marksman` ? `bipod` : `none`,
  optic: model === `rifle` || model === `precision` || model === `marksman` || model === `compoundbow` ? `precision` : `standard`,
});
export const getEquipmentOptions = (model?: WeaponModelId) => {
  const gun = [`rifle`, `smg`, `shotgun`, `precision`, `marksman`, `pistol`].includes(model ?? ``);
  const crossbow = model === `recurvebow` || model === `compoundbow`;
  const sword = [`longsword`, `katana`, `saber`, `greatsword`, `falchion`].includes(model ?? ``);
  const drone = model === `quadcopter` || model === `fixedwing`;
  return {
    optics: optics.filter(option => option.id === `standard` || (gun || crossbow) && (model !== `pistol` || option.id !== `precision`)),
    muzzles: muzzleOptions.filter(option => option.id === `none` || gun),
    underbarrels: underbarrelOptions.filter(option => option.id === `none` || (gun || crossbow) && model !== `pistol`),
    rails: railOptions.filter(option => option.id === `none` || gun || crossbow),
    stocks: stockOptions.filter(option => option.id === `none` || gun && model !== `pistol`),
    magazines: magazineOptions.filter(option => option.id === `standard` || gun && model !== `shotgun`),
    attachments: attachments.filter(option => option.id === `none` || (gun || crossbow) && (model !== `pistol` || option.id === `light` || option.id === `suppressor`) && (!crossbow || option.id !== `suppressor`)),
    customizations: customizations.filter(option => option.id === `none` || sword && [`scabbard`, `tassel`, `ornate-guard`].includes(option.id) || drone && [`camera`, `cargo`, `landing-kit`].includes(option.id)),
  };
};
export const getEffectiveEquipment = (model: WeaponModelId | undefined, equipment: Partial<EquipmentSelections>): ModelEquipment => {
  const selected = getStoredEquipment(equipment);
  const options = getEquipmentOptions(model);
  return {
    optic: options.optics.find(option => option.id === selected.optic)?.id ?? `standard`,
    muzzle: options.muzzles.find(option => option.id === selected.muzzle)?.id ?? `none`,
    rail: options.rails.find(option => option.id === selected.rail)?.id ?? `none`,
    stock: options.stocks.find(option => option.id === selected.stock)?.id ?? `none`,
    magazine: options.magazines.find(option => option.id === selected.magazine)?.id ?? `standard`,
    attachment: options.attachments.find(option => option.id === selected.attachment)?.id ?? `none`,
    underbarrel: options.underbarrels.find(option => option.id === selected.underbarrel)?.id ?? `none`,
    customization: options.customizations.find(option => option.id === selected.customization)?.id ?? `none`,
  };
};
export const getGunsmithSlots = (model: WeaponModelId | undefined, equipment: Partial<EquipmentSelections>): GunsmithSlot[] => {
  const selected = getEffectiveEquipment(model, equipment);
  const options = getEquipmentOptions(model);
  const entries: [EquipmentSlot, string, readonly EquipmentOption[]][] = [
    [`optic`, `Optic`, options.optics], [`muzzle`, `Muzzle`, options.muzzles],
    [`underbarrel`, `Underbarrel`, options.underbarrels], [`rail`, `Side Rail`, options.rails],
    [`stock`, `Stock`, options.stocks], [`magazine`, `Magazine`, options.magazines],
    [`customization`, options.customizations.some(option => option.id === `scabbard`) ? `Decorations` : `Add-On`, options.customizations],
  ];
  return entries.filter(([, , items]) => items.length > 1).map(([id, label, items]) => ({ id, label, options: items, value: selected[id] }));
};
export const isEquippedPart = (id: string) => id !== `none` && id !== `standard`;
export const getEquipmentKey = (equipment: ModelEquipment) => equipmentSlots.map(slot => equipment[slot]).join(`/`);
export const getEquipmentSummary = (model: WeaponModelId | undefined, equipment: Partial<EquipmentSelections>) => getGunsmithSlots(model, equipment)
  .filter(slot => slot.id === `optic` || isEquippedPart(slot.value)).map(slot => slot.options.find(option => option.id === slot.value)?.label).filter(Boolean).join(` / `);
