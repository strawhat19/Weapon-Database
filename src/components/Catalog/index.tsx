import Icon from '../Icon';
import './styles.scss';
import WeaponCard from '../WeaponCard';
import type { Category } from '../../types/types';
import useCatalog, { categoryFilters } from './useCatalog';

type CatalogProps = { defaultCategory?: Category; onOpenWeapon: (id: string) => void };

const Catalog = ({ onOpenWeapon, defaultCategory = `firearms` }: CatalogProps) => {
  const { query, category, setQuery, setCategory, loading, filteredWeapons, resetFilters } = useCatalog(defaultCategory);
  return (
    <section id="catalog" className="catalog-section">
      <div id="catalog-container" className="container catalog-container">
        <div id="catalog-heading" className="section-heading catalog-heading">
          <div id="catalog-heading-copy" className="catalog-heading-copy">
            <p id="catalog-eyebrow" className="eyebrow">The Armory Index</p>
            <h2 id={`catalog-title`} className={`catalog-title`}>Vault</h2>
          </div>
          <p id="catalog-introduction" className="catalog-introduction">Explore the collection by form, era, and design. Concept studies are clearly marked throughout.</p>
        </div>
        <div id="catalog-toolbar" className="catalog-toolbar">
          <div id="catalog-categories" className="catalog-categories" role="group" aria-label="Equipment categories">
            {categoryFilters.map(filter => (
              <button
                type="button"
                key={filter.id}
                id={`catalog-category-${filter.id}`}
                className={`catalog-category${category === filter.id ? ` is-active` : ``}`}
                aria-pressed={category === filter.id}
                onClick={() => setCategory(filter.id)}
              >
                <Icon name={filter.id} size={16} className={`catalog-category-icon`} />
                <span id={`catalog-category-label-${filter.id}`}>{filter.label}</span>
              </button>
            ))}
          </div>
          <label id="catalog-search-label" className="catalog-search" htmlFor="catalog-search-input">
            <Icon name="search" size={17} />
            <input
              type="search"
              value={query}
              id="catalog-search-input"
              className="catalog-search-input"
              placeholder="Search the collection"
              aria-label="Search the equipment collection"
              onChange={event => setQuery(event.currentTarget.value)}
            />
          </label>
        </div>
        <div id="catalog-results-summary" className="catalog-results-summary mono" role="status" aria-live="polite">
          {loading ? `Loading the collection` : `${filteredWeapons.length} ${filteredWeapons.length === 1 ? `Entry` : `Entries`}`}
          {(query || category !== `all`) && <button type="button" id="catalog-reset-filters" className="catalog-reset" onClick={resetFilters}>Clear Filters <Icon name="x" size={13} /></button>}
        </div>
        <div id="catalog-grid" className="catalog-grid" aria-busy={loading}>
          {loading ? [0, 1, 2].map(index => <div key={index} id={`catalog-loading-${index}`} className={`catalog-skeleton`} aria-hidden={true}><div className={`catalog-skeleton__image`} /><div className={`catalog-skeleton__copy`}><span /><span /><span /></div></div>) : filteredWeapons.map(weapon => <WeaponCard key={weapon.id} weapon={weapon} onOpenWeapon={onOpenWeapon} />)}
        </div>
        {!loading && !filteredWeapons.length && (
          <div id="catalog-empty" className="catalog-empty">
            <Icon name="search" size={28} />
            <h3 id="catalog-empty-title" className="catalog-empty-title">No Entries Found</h3>
            <p id="catalog-empty-copy" className="catalog-empty-copy">Try a different search or return to the complete collection.</p>
            <button type="button" id="catalog-empty-reset" className="button button--quiet" onClick={resetFilters}>View All Equipment <Icon name="arrow" size={16} /></button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Catalog;
