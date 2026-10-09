import { useMemo } from 'react';
import { useArmory } from '../../shared/armoryContext';

export { categories as categoryFilters } from '../../shared/catalog';

const useCatalog = () => {
  const { weapons, query, category, setQuery, setCategory, loading } = useArmory();
  const filteredWeapons = useMemo(() => {
    const search = query.trim().toLowerCase();
    return weapons.filter(weapon => {
      const matchesCategory = category === `all` || weapon.category === category;
      const searchable = [weapon.title, weapon.subtitle, weapon.description, weapon.era, weapon.tag].join(` `).toLowerCase();
      return matchesCategory && (!search || searchable.includes(search));
    });
  }, [weapons, query, category]);
  const resetFilters = () => { setQuery(``); setCategory(`all`); };
  return { query, category, setQuery, setCategory, loading, filteredWeapons, resetFilters };
};

export default useCatalog;
