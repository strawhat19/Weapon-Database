export type SectionId = `hero` | `catalog` | `loadout-lab` | `journal` | `history`;
export type InfoTopic = `about` | `api` | `contact` | `terms` | `privacy`;
type MenuLink = { id: string; label: string; icon: `info` | `book` | `code` | `shield` | `mail`; section?: SectionId; topic?: InfoTopic };

export const menuLinks: MenuLink[] = [
  { id: `about`, label: `About`, icon: `info`, topic: `about` },
  { id: `blog`, label: `Blog`, icon: `book`, section: `journal` },
  { id: `api`, label: `API`, icon: `code`, topic: `api` },
  { id: `weapons`, label: `Weapons`, icon: `shield`, section: `catalog` },
  { id: `contact`, label: `Contact`, icon: `mail`, topic: `contact` },
];

export const sections: { id: SectionId; label: string; icon: `book` | `sliders` | `clock` | `shield` }[] = [
  { id: `catalog`, label: `Catalog`, icon: `shield` },
  { id: `loadout-lab`, label: `Loadout Lab`, icon: `sliders` },
  { id: `journal`, label: `Journal`, icon: `book` },
  { id: `history`, label: `Warfare History`, icon: `clock` },
];

export const scrollToSection = (id: SectionId) => {
  if (typeof document === `undefined`) return;
  const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
  document.getElementById(id)?.scrollIntoView({ block: `start`, behavior: reducedMotion ? `auto` : `smooth` });
};
