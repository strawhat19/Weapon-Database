import Icon from '../Icon';
import './styles.scss';
import type { Weapon } from '../../shared/models';
import { useArmory } from '../../shared/armoryContext';
import { scrollToSection } from '../../shared/routes';

type WeaponCardProps = { weapon: Weapon; onOpenWeapon: (id: string) => void };

const WeaponCard = ({ weapon, onOpenWeapon }: WeaponCardProps) => {
  const { savedWeaponIds, toggleSavedWeapon, selectWeaponForBuild, busy } = useArmory();
  const saved = savedWeaponIds.includes(weapon.id);
  const buildWeapon = () => { selectWeaponForBuild(weapon.id); scrollToSection(`loadout-lab`); };
  return (
    <article id={`weapon-card-${weapon.id}`} className={`weapon-card weapon-card--${weapon.imageStyle} weapon-card--${weapon.id}`}>
      <div id={`weapon-card-media-${weapon.id}`} className="weapon-card-media">
        <button type="button" id={`weapon-card-preview-${weapon.id}`} className="weapon-card-preview" onClick={() => onOpenWeapon(weapon.id)} aria-label={`Inspect ${weapon.title}`}>
          <img id={`weapon-card-image-${weapon.id}`} className="weapon-card-image" src={weapon.image} alt={`${weapon.title} reference image`} loading="lazy" />
        </button>
        <span id={`weapon-card-tag-${weapon.id}`} className="weapon-card-tag mono">{weapon.isConcept ? `Design Study` : weapon.tag}</span>
        <button
          type="button"
          disabled={busy}
          aria-pressed={saved}
          id={`weapon-card-save-${weapon.id}`}
          className={`icon-button weapon-card-save${saved ? ` is-saved` : ``}`}
          aria-label={`${saved ? `Unsave` : `Save`} ${weapon.title}`}
          onClick={() => { void toggleSavedWeapon(weapon.id); }}
        >
          <Icon name={saved ? `check` : `bookmark`} size={17} />
        </button>
      </div>
      <div id={`weapon-card-content-${weapon.id}`} className="weapon-card-content">
        <p id={`weapon-card-category-${weapon.id}`} className="weapon-card-category mono">{weapon.category === `future` ? `Future Systems` : weapon.category} <span className="weapon-card-category-divider">/</span> {weapon.era}</p>
        <h3 id={`weapon-card-title-${weapon.id}`} className="weapon-card-title"><button type="button" id={`weapon-card-title-link-${weapon.id}`} className="weapon-card-title-link" onClick={() => onOpenWeapon(weapon.id)}>{weapon.title}</button></h3>
        <p id={`weapon-card-subtitle-${weapon.id}`} className="weapon-card-subtitle">{weapon.subtitle}</p>
        <div id={`weapon-card-stats-${weapon.id}`} className="weapon-card-stats">
          {weapon.stats?.slice(0, 2)?.map((stat, index) => (
            <div key={`${stat.label}-${index}`} id={`weapon-card-stat-${weapon.id}-${index}`} className="weapon-card-stat">
              <span id={`weapon-card-stat-label-${weapon.id}-${index}`} className="weapon-card-stat-label mono">{stat.label}</span>
              <span id={`weapon-card-stat-value-${weapon.id}-${index}`} className="weapon-card-stat-value">{stat.value}</span>
            </div>
          ))}
        </div>
        <div id={`weapon-card-actions-${weapon.id}`} className="weapon-card-actions">
          <button type="button" id={`weapon-card-inspect-${weapon.id}`} className="weapon-card-inspect" onClick={() => onOpenWeapon(weapon.id)}>Inspect Entry <Icon name="arrow" size={16} /></button>
          {weapon.modelId && <button type="button" id={`weapon-card-build-${weapon.id}`} className="weapon-card-build" onClick={buildWeapon}><Icon name="sliders" size={15} /> Build</button>}
        </div>
      </div>
    </article>
  );
};

export default WeaponCard;
