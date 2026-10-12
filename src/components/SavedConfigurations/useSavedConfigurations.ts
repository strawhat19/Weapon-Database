import { skins } from '../../shared/catalog';
import { useArmory } from '../../shared/armoryContext';
import { getEquipmentSummary } from '../../shared/catalog/equipment';

const useSavedConfigurations = (onEdit?: () => void) => {
  const { busy, error, loading, weapons, loadouts, editLoadout, deleteLoadout, editingLoadoutId } = useArmory();
  const configurations = loadouts.map(loadout => {
    const weapon = weapons.find(item => item.id === loadout.weaponId);
    return {
      ...loadout,
      weaponTitle: weapon?.title ?? `Collection Entry`,
      finishLabel: skins.find(option => option.id === loadout.skin)?.label,
      equipmentSummary: getEquipmentSummary(weapon?.modelId, loadout),
    };
  });
  const editConfiguration = (id: string) => {
    if (!loadouts.some(loadout => loadout.id === id)) return;
    editLoadout(id);
    onEdit?.();
  };
  return { busy, error, loading, configurations, deleteLoadout, editingLoadoutId, editConfiguration };
};
export default useSavedConfigurations;
