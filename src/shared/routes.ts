import { router } from 'expo-router';

export const pageRoutes = { home: `/`, weapons: `/weapons` } as const;
export type SectionId = `hero` | `catalog` | `loadout-lab` | `journal` | `history`;
export type InfoTopic = `about` | `api` | `contact` | `terms` | `privacy`;
type MenuLink = { id: string; label: string; path?: string; icon: `info` | `book` | `code` | `shield` | `mail`; section?: SectionId; topic?: InfoTopic };

export const menuLinks: MenuLink[] = [
  { id: `saved`, label: `Saved`, path: `/saved`, icon: `book` },
  { id: `about`, label: `About`, icon: `info`, topic: `about` },
  { id: `blog`, label: `Blog`, icon: `book`, section: `journal` },
  { id: `api`, label: `API`, icon: `code`, topic: `api` },
  { id: `weapons`, label: `Weapons`, icon: `shield`, path: pageRoutes.weapons },
  { id: `contact`, label: `Contact`, icon: `mail`, topic: `contact` },
];

export const sections: { id: SectionId; label: string; icon: `book` | `sliders` | `clock` | `shield` }[] = [
  { id: `catalog`, label: `Catalog`, icon: `shield` },
  { id: `loadout-lab`, label: `Loadout Lab`, icon: `sliders` },
  { id: `journal`, label: `Journal`, icon: `book` },
  { id: `history`, label: `Warfare History`, icon: `clock` },
];

export const isSectionId = (id: unknown): id is SectionId => id === `hero` || sections.some(section => section.id === id);
export const scrollToSection = (id: SectionId) => {
  if (typeof document === `undefined`) return;
  const element = document.getElementById(id);
  if (!element) { router.navigate(`${pageRoutes.home}#${id}`); return; }
  const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
  element.scrollIntoView({ block: `start`, behavior: reducedMotion ? `auto` : `smooth` });
};
export const scrollToTop = () => {
  if (typeof window === `undefined`) return;
  window.scrollTo({ top: 0, behavior: window.matchMedia(`(prefers-reduced-motion: reduce)`).matches ? `auto` : `smooth` });
};
