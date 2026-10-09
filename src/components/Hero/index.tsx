import './styles.scss';
import Icon from '../Icon';
import VaultOval from './VaultOval';
import WeaponModel from '../WeaponModel';
import { heroSkins, useHero } from './useHero';

type HeroProps = { onOpenWeapon: (id: string) => void };

const Hero = ({ onOpenWeapon }: HeroProps) => {
  const hero = useHero();
  const featuredNumber = String(hero.featuredIndex + 1).padStart(2, `0`);
  const featuredTitle = hero.featuredWeapon?.title ?? `ARX-27`;

  return (
    <section id={`hero`} aria-labelledby={`hero-title`} className={`armory-hero armory-hero--${hero.theme}`}>
      <div id={`hero-layout`} className={`container armory-hero__layout`}>
        <div id={`hero-introduction`} className={`hero-introduction`}>
          <p id={`hero-eyebrow`} className={`eyebrow hero-eyebrow`}>
            <span className={`hero-eyebrow__rule`} aria-hidden={true} />
            <span>{`01 / THE PUBLIC ARMORY`}</span>
          </p>
          <h1 id={`hero-title`} className={`hero-title`}>
            <span className={`hero-title__opening`}>{`OPEN THE`}</span>
            <span className={`hero-title__armory`}>{`ARMORY.`}</span>
          </h1>
          <p id={`hero-description`} className={`hero-description`}>
            <span>{`Every weapon has a story.`}</span>
            <span>{`Find yours in the archive.`}</span>
          </p>
          <p id={`hero-category-description`} className={`hero-category-description`}>{`Firearms, swords, drones and the systems of tomorrow.`}</p>
          <form id={`hero-search-form`} role={`search`} className={`hero-search`} onSubmit={hero.searchCatalog}>
            <label htmlFor={`hero-search-input`} className={`hero-search__label`}>{`Search the armory`}</label>
            <Icon name={`search`} size={22} className={`hero-search__icon`} />
            <input
              type={`search`}
              value={hero.query}
              autoComplete={`off`}
              ref={hero.searchInput}
              id={`hero-search-input`}
              className={`hero-search__input`}
              placeholder={`Search models, eras and platforms...`}
              onChange={event => hero.setQuery(event.target.value)}
            />
            <kbd className={`hero-search__shortcut`} aria-hidden={true}>{`/`}</kbd>
            <button type={`submit`} id={`hero-search-submit`} className={`hero-search__submit`} aria-label={`Search The Catalog`}>
              <Icon name={`arrow`} size={24} />
            </button>
          </form>
          <div id={`hero-primary-actions`} className={`hero-primary-actions`}>
            <button type={`button`} onClick={hero.browseCatalog} id={`hero-explore-catalog`} className={`hero-text-action hero-text-action--primary`}>
              <span>{`Explore catalog`}</span><Icon name={`arrow`} size={24} />
            </button>
            <span className={`hero-primary-actions__divider`} aria-hidden={true} />
            <button type={`button`} onClick={hero.buildLoadout} id={`hero-build-loadout`} className={`hero-text-action`}>
              <Icon name={`sliders`} size={22} /><span>{`Build a loadout`}</span>
            </button>
          </div>
          <button
            type={`button`}
            onClick={hero.saveFeatured}
            aria-pressed={hero.isSaved}
            id={`hero-save-featured-note`}
            disabled={!hero.featuredWeapon || hero.busy}
            className={`hero-save-note hero-save-note--desktop`}
          >
            <Icon name={hero.isSaved ? `check` : `bookmark`} size={16} />
            <span>{hero.isSaved ? `Featured weapon saved on this device.` : `Save weapons and custom classes on this device.`}</span>
          </button>
        </div>
        <div id={`hero-featured-specimen`} className={`hero-featured-specimen`} aria-label={`Featured Weapon`} aria-roledescription={`carousel`}>
          <div id={`hero-featured-heading`} className={`hero-featured-heading`}>
            <p className={`eyebrow`}>{`FEATURED ENTRY / ${String(hero.featuredIndex + 1).padStart(3, `0`)}`}</p>
            <span className={`mono hero-archive-badge`}>{`ARCHIVE`}</span>
            <span className={`mono hero-mobile-plate`}>{`PLATE / 027`}</span>
          </div>
          <div id={`hero-rifle-stage`} className={`hero-rifle-stage`}>
            <VaultOval dark={hero.theme === `dark`} />
            <div id={`hero-rifle-ground-shadow`} className={`hero-rifle-shadow`} aria-hidden={true} />
            <WeaponModel skin={hero.draft.skin} theme={hero.theme} title={featuredTitle} />
            <svg id={`hero-reference-details`} className={`hero-reference-details`} viewBox={`0 0 787 450`} aria-hidden={true}>
              <g id={`hero-reference-plate-detail`} className={`hero-reference-plate-detail`}>
                <text x={622} y={39} fontSize={8} letterSpacing={0.5}>{`REFERENCE PLATE`}</text>
                <text x={622} y={62} fontSize={16} letterSpacing={0.3} className={`hero-reference-plate-detail__value`}>{`ARX / 027`}</text>
                {[14, 22, 16, 22, 10, 18, 22].map((height, index) => (
                  <rect key={index} x={751 + index * 5} y={62 - height} height={height} width={index % 3 ? 1 : 2} opacity={0.32} id={`hero-serial-mark-${index}`} />
                ))}
                <path d={`M622 74H638`} className={`hero-reference-detail__accent`} />
                <path d={`M646 74H784`} className={`hero-reference-detail__rule`} />
              </g>
            </svg>
            <div id={`hero-carousel-controls`} className={`hero-carousel-controls`}>
              <span className={`mono hero-carousel-counter`} aria-live={`polite`} aria-atomic={true}>
                <strong>{featuredNumber}</strong><span>{`/ ${String(hero.featuredWeapons.length).padStart(2, `0`)}`}</span>
              </span>
              <div className={`hero-carousel-selectors`}>
                {hero.featuredWeapons.map((weapon, index) => (
                  <button
                    key={weapon.id}
                    type={`button`}
                    onClick={() => hero.selectFeatured(index)}
                    id={`hero-select-featured-${weapon.id}`}
                    aria-pressed={hero.featuredIndex === index}
                    aria-label={`Show ${weapon.title} ${weapon.subtitle} Design Study`}
                    className={`hero-carousel-selector${hero.featuredIndex === index ? ` hero-carousel-selector--active` : ``}`}
                  ><span aria-hidden={true} /></button>
                ))}
              </div>
              <button type={`button`} onClick={hero.nextFeatured} id={`hero-next-featured`} className={`hero-carousel-next`} aria-label={`Next Featured Weapon`}>
                <Icon name={`arrow`} size={16} />
              </button>
            </div>
          </div>
          <div id={`hero-featured-caption`} className={`hero-featured-caption`}>
            <h2 className={`hero-featured-caption__title`}>{featuredTitle}</h2>
            <span className={`mono hero-featured-caption__subtitle`}>{`MODULAR PLATFORM / VISUAL LOADOUT`}</span>
            <button
              type={`button`}
              disabled={!hero.featuredWeapon}
              id={`hero-open-featured-dossier`}
              className={`hero-text-action hero-dossier-action`}
              onClick={() => hero.featuredWeapon && onOpenWeapon(hero.featuredWeapon.id)}
            ><span>{`View dossier`}</span><Icon name={`arrow`} size={25} /></button>
          </div>
          <div id={`hero-loadout-preview`} className={`hero-loadout-preview`}>
            <span className={`mono hero-loadout-preview__label`}>{`SKIN`}</span>
            <div className={`hero-skin-swatches`} aria-label={`Loadout Skin`}>
              {heroSkins.map(skin => (
                <button
                  key={skin.id}
                  type={`button`}
                  style={{ backgroundColor: skin.color }}
                  onClick={() => hero.selectSkin(skin.id)}
                  id={`hero-select-skin-${skin.id}`}
                  aria-label={`Use ${skin.label} Skin`}
                  aria-pressed={hero.draft.skin === skin.id}
                  className={`hero-skin-swatch${hero.draft.skin === skin.id ? ` hero-skin-swatch--active` : ``}`}
                >{hero.draft.skin === skin.id && <Icon name={`check`} size={15} />}</button>
              ))}
            </div>
            <span className={`hero-loadout-preview__divider`} aria-hidden={true} />
            <button type={`button`} onClick={hero.buildLoadout} id={`hero-customize-optics`} className={`hero-optics-action`}>
              <span className={`hero-optics-action__desktop`}>{`OPTICS + ATTACHMENTS`}</span>
              <span className={`hero-optics-action__mobile`}>{`OPTICS + PARTS`}</span>
              <Icon name={`sliders`} size={22} />
            </button>
          </div>
          <div id={`hero-mobile-loadout-entry`} className={`hero-mobile-loadout-entry`}>
            <button type={`button`} onClick={hero.buildLoadout} id={`hero-mobile-build-loadout`} className={`hero-text-action`}>
              <Icon name={`sliders`} size={20} /><span>{`Build your loadout`}</span>
            </button>
            <button type={`button`} onClick={hero.saveFeatured} aria-pressed={hero.isSaved} disabled={!hero.featuredWeapon || hero.busy} id={`hero-mobile-save-featured`} className={`hero-save-note`}>
              <span>{hero.isSaved ? `Featured weapon saved on this device.` : `Save weapons and custom classes on this device.`}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
