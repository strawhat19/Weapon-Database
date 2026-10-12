import { useState } from 'react';
import { useTheme } from '../../shared/themeContext';
import { useArmory } from '../../shared/armoryContext';
import type { EquipmentSlot, EquipmentOption, LoadoutDraft } from '../../types/types';
import { equipmentSlots, getGunsmithSlots, getStoredEquipment, getEquipmentSummary, getEffectiveEquipment } from '../../shared/catalog/equipment';

export { skins as skinOptions } from '../../shared/catalog';
export { getEquipmentSummary } from '../../shared/catalog/equipment';
const useLoadoutLab = () => {
  const armory = useArmory();
  const { theme } = useTheme();
  const [activeSlot, setActiveSlot] = useState<EquipmentSlot>(`optic`);
  const [inspection, setInspection] = useState<{ slot: EquipmentSlot; option: EquipmentOption; weaponId: string } | null>(null);
  const equipment = armory.weapons.filter(weapon => weapon.modelId || weapon.id === armory.draft.weaponId);
  const selectedWeapon = armory.weapons.find(weapon => weapon.id === armory.draft.weaponId);
  const storedEquipment = getStoredEquipment(armory.draft);
  const selectedEquipment = getEffectiveEquipment(selectedWeapon?.modelId, armory.draft);
  const slots = getGunsmithSlots(selectedWeapon?.modelId, armory.draft);
  const summary = getEquipmentSummary(selectedWeapon?.modelId, armory.draft);
  const partLabels = summary ? summary.split(` / `) : [];
  const unavailableEquipment = equipmentSlots.some(slot => storedEquipment[slot] !== selectedEquipment[slot]);
  const updateDraft = <Key extends keyof typeof armory.draft>(key: Key, value: (typeof armory.draft)[Key]) => armory.setDraft(current => ({ ...current, [key]: value }));
  const equipPart = (slot: EquipmentSlot, id: string) => {
    if (!slots.find(item => item.id === slot)?.options.some(option => option.id === id)) return;
    armory.setDraft(current => ({ ...current, [slot]: id } as LoadoutDraft));
  };
  const inspectPart = (slot: EquipmentSlot, option: EquipmentOption) => {
    if (selectedWeapon?.modelId) setInspection({ slot, option, weaponId: selectedWeapon.id });
  };
  const resetParts = () => armory.setDraft(current => ({ ...current, ...getStoredEquipment({ optic: `standard`, attachment: `none` }) }));
  const closeInspection = () => setInspection(null);
  const equipInspectedPart = () => { if (inspection) equipPart(inspection.slot, inspection.option.id); closeInspection(); };
  return {
    ...armory, theme, slots, equipment, partLabels, activeSlot, selectedWeapon, selectedEquipment, unavailableEquipment,
    inspection: inspection?.weaponId === selectedWeapon?.id ? inspection : null,
    equipPart, resetParts, inspectPart, updateDraft, setActiveSlot, closeInspection, equipInspectedPart,
  };
};
export default useLoadoutLab;
