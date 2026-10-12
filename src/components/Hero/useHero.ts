import type { SkinId } from '../../types/types';
import { useTheme } from '../../shared/themeContext';
import { scrollToSection } from '../../shared/routes';
import { useArmory } from '../../shared/armoryContext';
import { getEffectiveEquipment } from '../../shared/catalog/equipment';
import { useEffect, useMemo, useRef, type FormEvent } from 'react';

export { skins as heroSkins } from '../../shared/catalog';

export const useHero = () => {
  const { theme } = useTheme();
  const searchInput = useRef<HTMLInputElement>(null);
  const { busy, weapons, query, draft, setQuery, setDraft, savedWeaponIds, toggleSavedWeapon, selectWeaponForBuild } = useArmory();
  const featuredWeapons = useMemo(() => weapons.filter(weapon => weapon.featured && weapon.modelId), [weapons]);
  const selectedWeapon = weapons.find(weapon => weapon.id === draft.weaponId);
  const featuredIndex = Math.max(0, featuredWeapons.findIndex(weapon => weapon.modelId === selectedWeapon?.modelId));
  const featuredWeapon = featuredWeapons?.[featuredIndex];
  const equipment = getEffectiveEquipment(featuredWeapon?.modelId ?? `rifle`, draft);
  const featuredOffset = Math.max(0, Math.min(featuredIndex - 2, featuredWeapons.length - 5));
  const hasFeaturedDraft = Boolean(featuredWeapon && featuredWeapon.modelId === selectedWeapon?.modelId);
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
  const searchCatalog = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); browseCatalog(); };
  const selectFeatured = (index: number) => {
    const weapon = featuredWeapons?.[index];
    if (weapon && weapon.id !== draft.weaponId) selectWeaponForBuild(weapon.id);
  };
  const nextFeatured = () => { if (featuredWeapons.length) selectFeatured((featuredIndex + 1) % featuredWeapons.length); };
  const buildLoadout = () => {
    if (featuredWeapon && !hasFeaturedDraft) selectWeaponForBuild(featuredWeapon.id);
    scrollToSection(`loadout-lab`);
  };
  const selectSkin = (skin: SkinId) => {
    if (featuredWeapon && !hasFeaturedDraft) selectWeaponForBuild(featuredWeapon.id);
    setDraft(current => ({ ...current, skin }));
  };
  const saveFeatured = () => { if (featuredWeapon) void toggleSavedWeapon(featuredWeapon.id); };
  return { busy, theme, query, draft, equipment, isSaved, setQuery, selectSkin, buildLoadout, saveFeatured, searchInput, nextFeatured, searchCatalog, browseCatalog, featuredIndex, featuredOffset, featuredWeapon, selectFeatured, featuredWeapons };
};
