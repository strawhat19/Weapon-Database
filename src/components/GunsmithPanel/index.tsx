import './styles.scss';
import Icon from '../Icon';
import PartIllustration from './PartIllustration';
import { isEquippedPart } from '../../shared/catalog/equipment';
import type { EquipmentSlot, GunsmithSlot, EquipmentOption } from '../../types/types';

type GunsmithPanelProps = {
  disabled: boolean;
  slots: GunsmithSlot[];
  activeSlot: EquipmentSlot;
  onReset: () => void;
  onViewBuild: () => void;
  onSelectSlot: (slot: EquipmentSlot) => void;
  onEquip: (slot: EquipmentSlot, id: string) => void;
  onInspect: (slot: EquipmentSlot, option: EquipmentOption) => void;
};
const GunsmithPanel = ({ slots, disabled, activeSlot, onReset, onEquip, onInspect, onSelectSlot, onViewBuild }: GunsmithPanelProps) => {
  const selectedSlot = slots.find(slot => slot.id === activeSlot) ?? slots[0];
  const count = slots.filter(slot => isEquippedPart(slot.value)).length;
  const defaultOption = selectedSlot?.options.find(option => !isEquippedPart(option.id));
  if (!selectedSlot) return null;
  return (
    <div id={`gunsmith-panel`} className={`gunsmith-panel`}>
      <div id={`gunsmith-header`} className={`gunsmith-header`}>
        <div id={`gunsmith-heading`}><h4 id={`gunsmith-title`}>Gunsmith</h4><span id={`gunsmith-count`} className={`mono`} aria-live={`polite`}>{count} / {slots.length} Slots Equipped</span></div>
        <div id={`gunsmith-toolbar`} className={`gunsmith-toolbar`}><button type={`button`} id={`gunsmith-view-build`} className={`gunsmith-text-action`} onClick={onViewBuild}><Icon name={`search`} size={13} />View Build</button><button type={`button`} id={`gunsmith-reset`} className={`gunsmith-text-action`} disabled={disabled} onClick={onReset}><Icon name={`rotate`} size={13} />Reset Parts</button></div>
      </div>
      <div id={`gunsmith-slots`} className={`gunsmith-slots`} role={`group`} aria-label={`Attachment Slots`}>
        {slots.map(slot => {
          const equipped = isEquippedPart(slot.value);
          const selected = slot.id === selectedSlot.id;
          const option = slot.options.find(item => item.id === slot.value);
          return <button type={`button`} key={slot.id} id={`gunsmith-slot-${slot.id}`} className={`gunsmith-slot${selected ? ` is-active` : ``}`} aria-pressed={selected} disabled={disabled} onClick={() => onSelectSlot(slot.id)}><span id={`gunsmith-slot-label-${slot.id}`} className={`gunsmith-slot-label mono`}>{slot.label}</span><span id={`gunsmith-slot-value-${slot.id}`} className={`gunsmith-slot-value`}>{option?.label}</span><span id={`gunsmith-slot-status-${slot.id}`} className={`gunsmith-slot-status${equipped ? ` is-equipped` : ``}`}><span className={`gunsmith-slot-dot`} />{equipped ? `Equipped` : `Factory`}</span></button>;
        })}
      </div>
      <div id={`gunsmith-catalog-heading`} className={`gunsmith-catalog-heading`}><h5 id={`gunsmith-catalog-title`}>{selectedSlot.label} Parts</h5><span className={`mono`}>Inspect · Equip · Rotate</span></div>
      <div id={`gunsmith-parts-${selectedSlot.id}`} className={`gunsmith-parts`}>
        {selectedSlot.options.map(option => {
          const selected = option.id === selectedSlot.value;
          const removable = selected && isEquippedPart(option.id) && defaultOption;
          return <article key={option.id} id={`gunsmith-part-${selectedSlot.id}-${option.id}`} className={`gunsmith-part${selected ? ` is-equipped` : ``}`}>
            <div id={`gunsmith-part-art-${selectedSlot.id}-${option.id}`} className={`gunsmith-part-art`}><PartIllustration id={`gunsmith-thumb-${selectedSlot.id}-${option.id}`} illustration={option.illustration} />{selected && <span className={`gunsmith-part-badge mono`}><Icon name={`check`} size={11} />Selected</span>}</div>
            <div id={`gunsmith-part-body-${selectedSlot.id}-${option.id}`} className={`gunsmith-part-body`}><h6>{option.label}</h6><p>{option.description}</p>
              <div className={`gunsmith-part-actions`}>
                <button type={`button`} id={`gunsmith-equip-${selectedSlot.id}-${option.id}`} className={`gunsmith-part-action${selected ? ` is-selected` : ``}`} disabled={disabled || selected && !removable} onClick={() => onEquip(selectedSlot.id, removable ? defaultOption.id : option.id)} aria-label={`${removable ? `Remove` : `Equip`} ${option.label}`}><Icon name={removable ? `x` : selected ? `check` : `plus`} size={13} />{removable ? `Remove` : selected ? `Selected` : `Equip`}</button>
                {isEquippedPart(option.id) && <button type={`button`} id={`gunsmith-inspect-${selectedSlot.id}-${option.id}`} className={`gunsmith-part-action`} disabled={disabled} onClick={() => onInspect(selectedSlot.id, option)} aria-label={`Inspect ${option.label} In 3D`}><Icon name={`search`} size={13} />Inspect</button>}
              </div>
            </div>
          </article>;
        })}
      </div>
    </div>
  );
};
export default GunsmithPanel;
