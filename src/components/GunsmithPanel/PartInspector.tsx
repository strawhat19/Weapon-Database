import Icon from '../Icon';
import WeaponModel from '../WeaponModel';
import { useEffect, useRef } from 'react';
import PartThumbnail from './PartThumbnail';
import type { Weapon, SkinId, ThemeMode, ModelEquipment, EquipmentSlot, EquipmentOption } from '../../types/types';

type PartInspectorProps = {
  skin: SkinId;
  weapon: Weapon;
  theme: ThemeMode;
  disabled: boolean;
  slot: EquipmentSlot;
  option: EquipmentOption;
  equipment: ModelEquipment;
  onClose: () => void;
  onEquip: () => void;
};
const PartInspector = ({ skin, slot, theme, weapon, option, equipment, disabled, onClose, onEquip }: PartInspectorProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const equipped = equipment[slot] === option.id;
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => { if (element?.open) element.close(); };
  }, []);
  return (
    <dialog ref={dialog} id={`gunsmith-inspector`} className={`gunsmith-inspector`} aria-labelledby={`gunsmith-inspector-title`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
      <div id={`gunsmith-inspector-content`} className={`gunsmith-inspector-content`}>
        <div id={`gunsmith-inspector-header`} className={`gunsmith-inspector-header`}><div><p className={`mono`}>Attachment Inspection / {weapon.title}</p><h3 id={`gunsmith-inspector-title`}>{option.label}</h3></div><button type={`button`} id={`gunsmith-inspector-close`} className={`gunsmith-inspector-close`} onClick={onClose} aria-label={`Close Attachment Inspector`}><Icon name={`x`} size={18} /></button></div>
        <div id={`gunsmith-inspector-stage`} className={`gunsmith-inspector-stage`}>{weapon.modelId && <WeaponModel showZoom id={`gunsmith-part-model`} skin={skin} theme={theme} image={weapon.image} title={option.label} modelId={weapon.modelId} equipment={equipment} inspection={{ slot, id: option.id }} fallback={<PartThumbnail id={`gunsmith-inspector-fallback-art`} modelId={weapon.modelId} illustration={option.illustration} />} />}</div>
        <div id={`gunsmith-inspector-footer`} className={`gunsmith-inspector-footer`}><p>{option.description}</p><button type={`button`} id={`gunsmith-inspector-equip`} className={`button button--primary`} disabled={disabled || equipped} onClick={onEquip}><Icon name={equipped ? `check` : `plus`} size={15} />{equipped ? `Equipped` : `Equip Part`}</button></div>
      </div>
    </dialog>
  );
};
export default PartInspector;
