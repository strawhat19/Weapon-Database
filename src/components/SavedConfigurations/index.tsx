import './styles.scss';
import Icon from '../Icon';
import useSavedConfigurations from './useSavedConfigurations';

type SavedConfigurationsProps = { onEdit?: () => void };

const SavedConfigurations = ({ onEdit }: SavedConfigurationsProps) => {
  const { busy, error, loading, configurations, deleteLoadout, editingLoadoutId, editConfiguration } = useSavedConfigurations(onEdit);
  return (
    <section id={`saved-configurations`} className={`saved-configurations-section`} aria-labelledby={`loadout-saved-title`} aria-busy={loading}>
      <div id={`saved-configurations-container`} className={`container saved-configurations-container`}>
        <div id={`loadout-saved-heading`} className={`loadout-saved-heading`}>
          <h2 id={`loadout-saved-title`} className={`loadout-saved-title`}>Saved Configurations</h2>
          <span id={`loadout-saved-count`} className={`mono`}>{loading ? `Loading Builds` : `${configurations.length} ${configurations.length === 1 ? `Build` : `Builds`}`}</span>
        </div>
        {loading ? <div id={`loadout-saved-loading`} className={`loadout-saved-grid`}>
          {[0, 1, 2].map(index => <div key={index} id={`saved-loadout-loading-${index}`} className={`saved-loadout saved-loadout-skeleton`} aria-hidden={true}><span /><span /><span /></div>)}
        </div> : configurations.length ? <div id={`loadout-saved-grid`} className={`loadout-saved-grid`}>
          {configurations.map(loadout => <article key={loadout.id} id={`saved-loadout-${loadout.id}`} className={`saved-loadout${editingLoadoutId === loadout.id ? ` is-editing` : ``}`}>
            <div id={`saved-loadout-heading-${loadout.id}`} className={`saved-loadout-heading`}><span id={`saved-loadout-number-${loadout.id}`} className={`mono`}>Build {String(loadout.number).padStart(2, `0`)}</span><Icon name={`sliders`} size={16} /></div>
            <h3 id={`saved-loadout-name-${loadout.id}`} className={`saved-loadout-name`}>{loadout.name}</h3>
            <p id={`saved-loadout-equipment-${loadout.id}`} className={`saved-loadout-equipment`}>{loadout.weaponTitle}</p>
            <p id={`saved-loadout-specs-${loadout.id}`} className={`saved-loadout-specs mono`}>{loadout.finishLabel}{loadout.equipmentSummary ? ` / ${loadout.equipmentSummary}` : ``}</p>
            <div id={`saved-loadout-actions-${loadout.id}`} className={`saved-loadout-actions`}>
              <button type={`button`} id={`saved-loadout-edit-${loadout.id}`} className={`saved-loadout-action`} disabled={busy} onClick={() => editConfiguration(loadout.id)}><Icon name={`edit`} size={14} />Edit Build</button>
              <button type={`button`} id={`saved-loadout-delete-${loadout.id}`} className={`saved-loadout-action saved-loadout-delete`} disabled={busy} onClick={() => { void deleteLoadout(loadout.id); }} aria-label={`Delete ${loadout.name}`}><Icon name={`trash`} size={14} />Delete</button>
            </div>
          </article>)}
        </div> : <div id={`loadout-saved-empty`} className={`loadout-saved-empty`}>
          <Icon name={error ? `info` : `bookmark`} size={20} />
          <p id={`loadout-saved-empty-copy`} className={`loadout-saved-empty-copy`}>{error ? `Saved Configurations Unavailable` : `Your saved configurations will appear here.`}</p>
          <span id={`loadout-saved-empty-note`} className={`loadout-saved-empty-note`}>{error ?? `Choose a finish in the weapon builder and save your first build.`}</span>
        </div>}
      </div>
    </section>
  );
};
export default SavedConfigurations;
