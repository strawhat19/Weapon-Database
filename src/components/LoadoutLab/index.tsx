import Icon from '../Icon';
import './styles.scss';
import { scrollToSection } from '../../shared/routes';
import useLoadoutLab, { skinOptions, opticOptions, attachmentOptions } from './useLoadoutLab';

const LoadoutLab = () => {
  const { draft, busy, rifles, loadouts, selectedWeapon, editingLoadoutId, saveDraft, deleteLoadout, editLoadout, resetDraft, selectWeaponForBuild, updateDraft } = useLoadoutLab();
  const opticLabel = opticOptions.find(option => option.id === draft.optic)?.label;
  const attachmentLabel = attachmentOptions.find(option => option.id === draft.attachment)?.label;
  const finishLabel = skinOptions.find(option => option.id === draft.skin)?.label;
  return (
    <section id="loadout-lab" className="loadout-section">
      <div id="loadout-container" className="container loadout-container">
        <div id="loadout-heading" className="section-heading loadout-heading">
          <div id="loadout-heading-copy" className="loadout-heading-copy">
            <p id="loadout-eyebrow" className="eyebrow">Personal Configuration</p>
            <h2 id="loadout-title" className="loadout-title">A Place to Make It Yours</h2>
          </div>
          <p id="loadout-introduction" className="loadout-introduction">Compose a visual study with a finish, optic, and accessory. Save your combinations to this browser.</p>
        </div>
        <div id="loadout-builder" className="loadout-builder">
          <div id="loadout-preview" className={`loadout-preview loadout-preview--${draft.skin}`}>
            <div id="loadout-preview-meta" className="loadout-preview-meta mono"><span id="loadout-preview-status">{editingLoadoutId ? `Editing Saved Build` : `Visual Study`}</span><span id="loadout-preview-finish">{finishLabel}</span></div>
            <div id="loadout-preview-canvas" className="loadout-preview-canvas">
              {selectedWeapon ? <img id="loadout-preview-image" className="loadout-preview-image" src={selectedWeapon.image} alt={`${selectedWeapon.title} in ${finishLabel} visual finish`} loading="lazy" /> : <p id="loadout-preview-empty" className="loadout-preview-empty">Select an entry to begin your visual study.</p>}
              {selectedWeapon && <div id="loadout-preview-selection" className="loadout-preview-selection"><span id="loadout-preview-optic" className="loadout-preview-chip mono"><Icon name="sliders" size={12} />{opticLabel} Optic</span><span id="loadout-preview-accessory" className="loadout-preview-chip mono">{draft.attachment === `none` ? `No Accessory` : attachmentLabel}</span></div>}
            </div>
            <div id="loadout-preview-caption" className="loadout-preview-caption"><h3 id="loadout-preview-title" className="loadout-preview-title">{selectedWeapon?.title ?? `Your Next Build`}</h3><p id="loadout-preview-note" className="loadout-preview-note">Design preview. Finishes are illustrative; selections do not describe real-world compatibility.</p></div>
          </div>
          <form id="loadout-form" className="loadout-form" onSubmit={event => { event.preventDefault(); void saveDraft(); }}>
            <div id="loadout-form-header" className="loadout-form-header"><Icon name="sliders" size={20} /><h3 id="loadout-form-title" className="loadout-form-title">{editingLoadoutId ? `Refine Your Build` : `Build Your Configuration`}</h3></div>
            <label id="loadout-weapon-label" className="loadout-field" htmlFor="loadout-weapon-input"><span className="loadout-field-label mono">Equipment</span><select id="loadout-weapon-input" className="loadout-input" value={draft.weaponId} disabled={busy} onChange={event => selectWeaponForBuild(event.currentTarget.value)}>{rifles.map(weapon => <option id={`loadout-weapon-option-${weapon.id}`} key={weapon.id} value={weapon.id}>{weapon.title}</option>)}</select></label>
            <label id="loadout-name-label" className="loadout-field" htmlFor="loadout-name-input"><span className="loadout-field-label mono">Build Name</span><input id="loadout-name-input" className="loadout-input" value={draft.name} maxLength={60} required disabled={busy} placeholder="Name your configuration" onChange={event => updateDraft(`name`, event.currentTarget.value)} /></label>
            <fieldset id="loadout-skin-options" className="loadout-skins"><legend id="loadout-skin-label" className="loadout-field-label mono">Finish</legend><div id="loadout-skin-grid" className="loadout-skin-grid">{skinOptions.map(skin => <button type="button" key={skin.id} id={`loadout-skin-${skin.id}`} className={`loadout-skin${draft.skin === skin.id ? ` is-active` : ``}`} aria-pressed={draft.skin === skin.id} disabled={busy} onClick={() => updateDraft(`skin`, skin.id)}><span id={`loadout-skin-swatch-${skin.id}`} className={`loadout-skin-swatch loadout-skin-swatch--${skin.id}`} /><span id={`loadout-skin-name-${skin.id}`}>{skin.label}</span>{draft.skin === skin.id && <Icon name="check" size={12} />}</button>)}</div></fieldset>
            <div id="loadout-selects" className="loadout-selects">
              <label id="loadout-optic-label" className="loadout-field" htmlFor="loadout-optic-input"><span className="loadout-field-label mono">Optic</span><select id="loadout-optic-input" className="loadout-input" value={draft.optic} disabled={busy} onChange={event => updateDraft(`optic`, event.currentTarget.value as typeof draft.optic)}>{opticOptions.map(option => <option key={option.id} id={`loadout-optic-option-${option.id}`} value={option.id}>{option.label}</option>)}</select></label>
              <label id="loadout-attachment-label" className="loadout-field" htmlFor="loadout-attachment-input"><span className="loadout-field-label mono">Accessory</span><select id="loadout-attachment-input" className="loadout-input" value={draft.attachment} disabled={busy} onChange={event => updateDraft(`attachment`, event.currentTarget.value as typeof draft.attachment)}>{attachmentOptions.map(option => <option key={option.id} id={`loadout-attachment-option-${option.id}`} value={option.id}>{option.label}</option>)}</select></label>
            </div>
            <div id="loadout-form-actions" className="loadout-form-actions"><button id="loadout-save" className="button button--primary loadout-save" type="submit" disabled={busy || !draft.name.trim() || !selectedWeapon}><Icon name={editingLoadoutId ? `check` : `bookmark`} size={16} />{busy ? `Saving…` : editingLoadoutId ? `Save Changes` : `Save Build`}</button><button type="button" id="loadout-reset" className="button button--quiet loadout-reset" disabled={busy} onClick={resetDraft}><Icon name={editingLoadoutId ? `x` : `plus`} size={15} />{editingLoadoutId ? `Cancel Edit` : `New Build`}</button></div>
          </form>
        </div>
        <div id="loadout-saved-heading" className="loadout-saved-heading"><h3 id="loadout-saved-title" className="loadout-saved-title">Saved Configurations</h3><span id="loadout-saved-count" className="mono">{loadouts.length} {loadouts.length === 1 ? `Build` : `Builds`}</span></div>
        {loadouts.length ? <div id="loadout-saved-grid" className="loadout-saved-grid">{loadouts.map(loadout => {
          const weapon = rifles.find(item => item.id === loadout.weaponId);
          return <article key={loadout.id} id={`saved-loadout-${loadout.id}`} className={`saved-loadout${editingLoadoutId === loadout.id ? ` is-editing` : ``}`}><div id={`saved-loadout-heading-${loadout.id}`} className="saved-loadout-heading"><span id={`saved-loadout-number-${loadout.id}`} className="mono">Build {String(loadout.number).padStart(2, `0`)}</span><Icon name="sliders" size={16} /></div><h4 id={`saved-loadout-name-${loadout.id}`} className="saved-loadout-name">{loadout.name}</h4><p id={`saved-loadout-equipment-${loadout.id}`} className="saved-loadout-equipment">{weapon?.title ?? `Collection Entry`}</p><p id={`saved-loadout-specs-${loadout.id}`} className="saved-loadout-specs mono">{skinOptions.find(option => option.id === loadout.skin)?.label} / {opticOptions.find(option => option.id === loadout.optic)?.label} / {attachmentOptions.find(option => option.id === loadout.attachment)?.label}</p><div id={`saved-loadout-actions-${loadout.id}`} className="saved-loadout-actions"><button type="button" id={`saved-loadout-edit-${loadout.id}`} className="saved-loadout-action" disabled={busy} onClick={() => { editLoadout(loadout.id); scrollToSection(`loadout-lab`); }}><Icon name="edit" size={14} />Edit Build</button><button type="button" id={`saved-loadout-delete-${loadout.id}`} className="saved-loadout-action saved-loadout-delete" disabled={busy} onClick={() => { void deleteLoadout(loadout.id); }} aria-label={`Delete ${loadout.name}`}><Icon name="trash" size={14} />Delete</button></div></article>;
        })}</div> : <div id="loadout-saved-empty" className="loadout-saved-empty"><Icon name="bookmark" size={20} /><p id="loadout-saved-empty-copy">Your saved configurations will appear here.</p><span id="loadout-saved-empty-note" className="loadout-saved-empty-note">Choose a finish above and save your first build.</span></div>}
      </div>
    </section>
  );
};

export default LoadoutLab;
