import { useTheme } from '../../shared/themeContext';
import { scrollToSection } from '../../shared/routes';
import { useArmory } from '../../shared/armoryContext';
import { useEffect, useRef, useState, type FormEvent } from 'react';

export const heroSkins = [
  { id: `olive`, label: `Olive`, color: `#375540` },
  { id: `graphite`, label: `Graphite`, color: `#17181A` },
  { id: `silver`, label: `Silver`, color: `#859398` },
] as const;

export const useHero = () => {
  const { theme } = useTheme();
  const searchInput = useRef<HTMLInputElement>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const { busy, weapons, query, draft, setQuery, setDraft, savedWeaponIds, toggleSavedWeapon, selectWeaponForBuild } = useArmory();
  const featuredWeapons = weapons.slice(0, 3);
  const featuredWeapon = featuredWeapons?.[featuredIndex] ?? featuredWeapons?.[0];
  const isSaved = Boolean(featuredWeapon && savedWeaponIds.includes(featuredWeapon.id));

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditing = target?.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName ?? ``);
      if (event.key !== `/` || event.altKey || event.ctrlKey || event.metaKey || isEditing) return;
      event.preventDefault();
      searchInput.current?.focus();
    };
    window.addEventListener(`keydown`, focusSearch);
    return () => window.removeEventListener(`keydown`, focusSearch);
  }, []);

  const browseCatalog = () => scrollToSection(`catalog`);
  const searchCatalog = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    browseCatalog();
  };
  const selectFeatured = (index: number) => {
    const weapon = featuredWeapons?.[index];
    if (!weapon || index === featuredIndex) return;
    setFeaturedIndex(index);
    selectWeaponForBuild(weapon.id);
  };
  const nextFeatured = () => {
    if (featuredWeapons.length) selectFeatured((featuredIndex + 1) % featuredWeapons.length);
  };
  const buildLoadout = () => {
    if (featuredWeapon && draft.weaponId !== featuredWeapon.id) selectWeaponForBuild(featuredWeapon.id);
    scrollToSection(`loadout-lab`);
  };
  const selectSkin = (skin: (typeof heroSkins)[number][`id`]) => {
    if (featuredWeapon && draft.weaponId !== featuredWeapon.id) selectWeaponForBuild(featuredWeapon.id);
    setDraft(current => ({ ...current, skin }));
  };
  const saveFeatured = () => {
    if (featuredWeapon) toggleSavedWeapon(featuredWeapon.id);
  };

  return {
    busy,
    theme,
    query,
    draft,
    isSaved,
    setQuery,
    selectSkin,
    buildLoadout,
    saveFeatured,
    searchInput,
    nextFeatured,
    searchCatalog,
    browseCatalog,
    featuredIndex,
    featuredWeapon,
    selectFeatured,
    featuredWeapons,
  };
};
