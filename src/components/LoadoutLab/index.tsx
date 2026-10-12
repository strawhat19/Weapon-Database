import './styles.scss';
import Icon from '../Icon';
import WeaponModel from '../WeaponModel';
import GunsmithPanel from '../GunsmithPanel';
import PartInspector from '../GunsmithPanel/PartInspector';
import useLoadoutLab, { skinOptions } from './useLoadoutLab';

const LoadoutLab = () => {
  const { draft, busy, theme, slots, equipment, inspection, selectedWeapon, selectedEquipment, unavailableEquipment, equipPart, resetParts, inspectPart, closeInspection, equipInspectedPart, editingLoadoutId, saveDraft, resetDraft, storageDescription, selectWeaponForBuild, updateDraft } = useLoadoutLab();
  const finishLabel = skinOptions.find(option => option.id === draft.skin)?.label;
  return (
    <section id={`loadout-lab`} className={`loadout-section`}>
      {inspection && selectedWeapon && <PartInspector skin={draft.skin} theme={theme} disabled={busy} weapon={selectedWeapon} slot={inspection.slot} option={inspection.option} equipment={selectedEquipment} onClose={closeInspection} onEquip={equipInspectedPart} />}
      <div id={`loadout-container`} className={`container loadout-container`}>
        <div id={`loadout-heading`} className={`section-heading loadout-heading`}>
          <div id={`loadout-heading-copy`} className={`loadout-heading-copy`}>
            <p id={`loadout-eyebrow`} className={`eyebrow`}>Personal Configuration</p>
            <h2 id={`loadout-title`} className={`loadout-title`}>A Place to Make It Yours</h2>
          </div>
          <p id={`loadout-introduction`} className={`loadout-introduction`}>Inspect parts in 3D, equip independent attachment slots, and save your finished build to this browser.</p>
        </div>
        <form id={`loadout-builder`} className={`loadout-builder`} data-slot-count={slots.length} aria-labelledby={`loadout-form-title`} onSubmit={event => { event.preventDefault(); void saveDraft(); }}>
          <div id={`loadout-preview`} className={`loadout-preview loadout-preview--${draft.skin}`}>
            <div id={`loadout-preview-meta`} className={`loadout-preview-meta mono`}><span id={`loadout-preview-status`}>{editingLoadoutId ? `Editing Saved Build` : `Visual Study`}</span><span id={`loadout-preview-finish`}>{finishLabel}</span></div>
            <div id={`loadout-preview-canvas`} className={`loadout-preview-canvas`}>
              {selectedWeapon?.modelId ? (
                <WeaponModel
                  showZoom
                  theme={theme}
                  skin={draft.skin}
                  equipment={selectedEquipment}
                  title={selectedWeapon.title}
                  image={selectedWeapon.image}
                  id={`loadout-weapon-model`}
                  modelId={selectedWeapon.modelId}
                />
              ) : selectedWeapon ? <img id={`loadout-preview-image`} className={`loadout-preview-image`} src={selectedWeapon.image} alt={`${selectedWeapon.title} Design Study`} loading={`lazy`} /> : <p id={`loadout-preview-empty`} className={`loadout-preview-empty`}>Select an entry to begin your visual study.</p>}
            </div>
            <div id={`loadout-preview-caption`} className={`loadout-preview-caption`}><h3 id={`loadout-preview-title`} className={`loadout-preview-title`}>{selectedWeapon?.title ?? `Your Next Build`}</h3><p id={`loadout-preview-note`} className={`loadout-preview-note`}>Design preview. Finishes are illustrative; selections do not describe real-world compatibility.</p></div>
          </div>
          <div id={`loadout-form`} className={`loadout-form`}>
            <div id={`loadout-form-header`} className={`loadout-form-header`}>
              <div id={`loadout-form-heading`} className={`loadout-form-heading`}><Icon name={`sliders`} size={20} /><h3 id={`loadout-form-title`} className={`loadout-form-title`}>{editingLoadoutId ? `Refine Your Build` : `Build Your Configuration`}</h3></div>
              <div id={`loadout-form-actions`} className={`loadout-form-actions`}><span id={`loadout-storage-note`} className={`loadout-storage-note`}><Icon name={`bookmark`} size={13} />{storageDescription}</span><button type={`button`} id={`loadout-reset`} className={`loadout-new-build`} disabled={busy} onClick={resetDraft}><Icon name={editingLoadoutId ? `x` : `plus`} size={14} />{editingLoadoutId ? `Cancel Edit` : `New Build`}</button></div>
            </div>
            <fieldset id={`loadout-skin-options`} className={`loadout-skins`}><legend id={`loadout-skin-label`} className={`loadout-field-label mono`}>{selectedWeapon?.category === `swords` ? `Hilt Finish` : `Finish`}</legend><div id={`loadout-skin-grid`} className={`loadout-skin-grid`}>{skinOptions.map(skin => <button type={`button`} key={skin.id} id={`loadout-skin-${skin.id}`} className={`loadout-skin${draft.skin === skin.id ? ` is-active` : ``}`} aria-pressed={draft.skin === skin.id} disabled={busy} onClick={() => updateDraft(`skin`, skin.id)}><span id={`loadout-skin-swatch-${skin.id}`} className={`loadout-skin-swatch loadout-skin-swatch--${skin.id}`} style={{ background: skin.swatch }} /><span id={`loadout-skin-name-${skin.id}`}>{skin.label}</span>{draft.skin === skin.id && <Icon name={`check`} size={12} />}</button>)}</div></fieldset>
            <div id={`loadout-identity`} className={`loadout-identity`}>
              <label id={`loadout-weapon-label`} className={`loadout-field loadout-field--weapon`} htmlFor={`loadout-weapon-input`}><span className={`loadout-field-label mono`}>Equipment</span><select id={`loadout-weapon-input`} className={`loadout-input`} value={draft.weaponId} disabled={busy} onChange={event => selectWeaponForBuild(event.currentTarget.value)}>{equipment.map(weapon => <option id={`loadout-weapon-option-${weapon.id}`} key={weapon.id} value={weapon.id}>{weapon.title}</option>)}</select></label>
              <label id={`loadout-name-label`} className={`loadout-field loadout-field--name`} htmlFor={`loadout-name-input`}><span className={`loadout-field-label mono`}>Build Name</span><input id={`loadout-name-input`} className={`loadout-input`} value={draft.name} maxLength={60} required disabled={busy} placeholder={`Name your configuration`} onChange={event => updateDraft(`name`, event.currentTarget.value)} /></label>
              <button id={`loadout-save`} className={`button button--primary loadout-save`} type={`submit`} disabled={busy || !draft.name.trim() || !selectedWeapon}><Icon name={editingLoadoutId ? `check` : `bookmark`} size={16} />{busy ? `Saving…` : `Save`}</button>
            </div>
            {unavailableEquipment && <p id={`loadout-equipment-note`} className={`loadout-equipment-note`}>This saved build includes unavailable equipment. Its stored choices are preserved.</p>}
          </div>
          <GunsmithPanel slots={slots} disabled={busy} modelId={selectedWeapon?.modelId} onEquip={equipPart} onReset={resetParts} onInspect={inspectPart} />
        </form>
      </div>
    </section>
  );
};
export default LoadoutLab;
