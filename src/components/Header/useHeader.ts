import { useEffect, useRef, useState } from 'react';
import { sections, type SectionId } from '../../shared/routes';

const useHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>(`catalog`);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);
  useEffect(() => {
    if (typeof window === `undefined`) return;
    let frame = 0;
    const updateHeader = () => {
      setScrolled(window.scrollY > 20);
      let active: SectionId = `catalog`;
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= 170) active = section.id;
      });
      setActiveSection(active);
    };
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(updateHeader); };
    updateHeader();
    window.addEventListener(`scroll`, onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener(`scroll`, onScroll); };
  }, []);
  useEffect(() => {
    if (!menuOpen || typeof window === `undefined`) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === `Escape`) { setMenuOpen(false); menuButtonRef.current?.focus(); }
    };
    const desktop = window.matchMedia(`(min-width: 1110px)`);
    const onDesktop = () => { if (desktop.matches) setMenuOpen(false); };
    window.addEventListener(`keydown`, onKeyDown);
    desktop.addEventListener(`change`, onDesktop);
    return () => { window.removeEventListener(`keydown`, onKeyDown); desktop.removeEventListener(`change`, onDesktop); };
  }, [menuOpen]);
  return { scrolled, menuOpen, activeSection, menuButtonRef, closeMenu, setMenuOpen, setActiveSection };
};

export default useHeader;
