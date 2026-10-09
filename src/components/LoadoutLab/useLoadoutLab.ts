import { useArmory } from '../../shared/armoryContext';

export { skins as skinOptions, optics as opticOptions, attachments as attachmentOptions } from '../../shared/catalog';

const useLoadoutLab = () => {
  const armory = useArmory();
  const rifles = armory.weapons.filter(weapon => weapon.category === `firearms`);
  const selectedWeapon = armory.weapons.find(weapon => weapon.id === armory.draft.weaponId);
  const updateDraft = <Key extends keyof typeof armory.draft>(key: Key, value: (typeof armory.draft)[Key]) => {
    armory.setDraft(current => ({ ...current, [key]: value }));
  };
  return { ...armory, rifles, selectedWeapon, updateDraft };
};

export default useLoadoutLab;
