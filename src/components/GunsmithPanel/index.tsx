import './styles.scss';
import Icon from '../Icon';
import type { KeyboardEvent } from 'react';
import PartThumbnail from './PartThumbnail';
import { isEquippedPart } from '../../shared/catalog/equipment';
import type { EquipmentSlot, GunsmithSlot, WeaponModelId, EquipmentOption } from '../../types/types';

type GunsmithPanelProps = {
  disabled: boolean;
  slots: GunsmithSlot[];
  onReset: () => void;
  modelId?: WeaponModelId;
  onEquip: (slot: EquipmentSlot, id: string) => void;
  onInspect: (slot: EquipmentSlot, option: EquipmentOption) => void;
};
const getVisibleOptions = (slot: GunsmithSlot) => slot.options.filter(option => isEquippedPart(option.id) || slot.id === `optic` && option.id === `standard`);
const GunsmithPanel = ({ slots, modelId, disabled, onReset, onEquip, onInspect }: GunsmithPanelProps) => {
  const count = slots.filter(slot => isEquippedPart(slot.value)).length;
  const sword = [`longsword`, `katana`, `saber`, `greatsword`, `falchion`].includes(modelId ?? ``);
  const selectWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, slot: GunsmithSlot, index: number) => {
    const keys = [`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End`];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const options = getVisibleOptions(slot);
    const last = options.length - 1;
    const nextIndex = event.key === `Home` ? 0 : event.key === `End` ? last : (index + (event.key === `ArrowLeft` || event.key === `ArrowUp` ? -1 : 1) + options.length) % options.length;
    const option = options[nextIndex];
    if (!option) return;
    onEquip(slot.id, option.id);
    event.currentTarget.closest(`.gunsmith-parts`)?.querySelector<HTMLButtonElement>(`[data-part-index="${nextIndex}"]`)?.focus();
  };
  if (!slots.length) return null;
  return (
    <div id={`gunsmith-panel`} className={`gunsmith-panel`}>
      <div id={`gunsmith-header`} className={`gunsmith-header`}>
        <div id={`gunsmith-heading`} className={`gunsmith-heading`}>
          <h4 id={`gunsmith-title`}>{sword ? `Swordsmith` : `Gunsmith`}</h4>
          <span id={`gunsmith-count`} className={`mono`} aria-live={`polite`}>{count} / {slots.length} Slots Equipped</span>
        </div>
        <button type={`button`} id={`gunsmith-reset`} className={`gunsmith-text-action`} disabled={disabled} onClick={onReset}><Icon name={`rotate`} size={13} />Reset Parts</button>
      </div>
      <p id={`gunsmith-instructions`} className={`gunsmith-instructions`}>{sword ? `Choose a decoration card to equip. Choose it again to remove it.` : `Choose a card to equip. Choose an equipped attachment again to deselect it.`}</p>
      <div id={`gunsmith-groups`} className={`gunsmith-groups`}>
        {slots.map(slot => {
          const options = getVisibleOptions(slot);
          const selectedIndex = options.findIndex(option => option.id === slot.value);
          const defaultOption = slot.options.find(option => !isEquippedPart(option.id));
          const currentOption = slot.options.find(option => option.id === slot.value);
          return <section key={slot.id} id={`gunsmith-group-${slot.id}`} className={`gunsmith-group`} aria-labelledby={`gunsmith-group-title-${slot.id}`}>
            <div id={`gunsmith-group-heading-${slot.id}`} className={`gunsmith-group-heading`}>
              <h5 id={`gunsmith-group-title-${slot.id}`}>{slot.label}</h5>
              <span id={`gunsmith-group-selection-${slot.id}`} className={`gunsmith-group-selection mono`}>{currentOption?.label}</span>
            </div>
            <div id={`gunsmith-parts-${slot.id}`} className={`gunsmith-parts${options.length === 1 ? ` gunsmith-parts--single` : options.length === 2 ? ` gunsmith-parts--pair` : ``}`} role={`radiogroup`} aria-labelledby={`gunsmith-group-title-${slot.id}`} aria-describedby={`gunsmith-instructions`}>
              {options.map((option, index) => {
                const selected = option.id === slot.value;
                const removable = selected && isEquippedPart(option.id) && defaultOption;
                const nextId = removable ? defaultOption.id : option.id;
                return <article key={option.id} id={`gunsmith-part-${slot.id}-${option.id}`} className={`gunsmith-part${selected ? ` is-equipped` : ``}`}>
                  <button
                    type={`button`}
                    role={`radio`}
                    disabled={disabled}
                    aria-checked={selected}
                    data-part-index={index}
                    tabIndex={index === Math.max(0, selectedIndex) ? 0 : -1}
                    className={`gunsmith-part-card`}
                    id={`gunsmith-equip-${slot.id}-${option.id}`}
                    onClick={() => onEquip(slot.id, nextId)}
                    onKeyDown={event => selectWithKeyboard(event, slot, index)}
                    aria-label={`${option.label}${removable ? `, Equipped. Choose Again To Restore ${defaultOption?.label}` : ``}`}
                    aria-describedby={`gunsmith-part-description-${slot.id}-${option.id}`}
                  >
                    <span id={`gunsmith-part-art-${slot.id}-${option.id}`} className={`gunsmith-part-art`}>
                      <PartThumbnail id={`gunsmith-thumb-${slot.id}-${option.id}`} modelId={modelId} illustration={option.illustration} />
                      {selected && <span id={`gunsmith-part-badge-${slot.id}-${option.id}`} className={`gunsmith-part-badge mono`}><Icon name={`check`} size={11} />Selected</span>}
                    </span>
                    <span id={`gunsmith-part-body-${slot.id}-${option.id}`} className={`gunsmith-part-body`}>
                      <span id={`gunsmith-part-label-${slot.id}-${option.id}`} className={`gunsmith-part-label`}>{option.label}</span>
                      <span id={`gunsmith-part-description-${slot.id}-${option.id}`} className={`gunsmith-part-description`}>{option.description}</span>
                    </span>
                  </button>
                  {isEquippedPart(option.id) && <button type={`button`} id={`gunsmith-inspect-${slot.id}-${option.id}`} className={`gunsmith-part-inspect`} disabled={disabled} onClick={() => onInspect(slot.id, option)} aria-label={`Inspect ${option.label} In 3D`} title={`Inspect ${option.label} In 3D`}><Icon name={`search`} size={15} /></button>}
                </article>;
              })}
            </div>
          </section>;
        })}
      </div>
    </div>
  );
};
export default GunsmithPanel;
