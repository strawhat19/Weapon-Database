import { useEffect, useState } from 'react';
import { appUrl } from '../../shared/assets';
import { useTheme } from '../../shared/themeContext';
import { useArmory } from '../../shared/armoryContext';
import { usePathname, useLocalSearchParams } from 'expo-router';
import { isSectionId, scrollToSection, type InfoTopic } from '../../shared/routes';

export const useAppShell = () => {
  const pathname = usePathname();
  const sectionHash = useLocalSearchParams<{ '#': string }>()[`#`];
  const { theme, palette } = useTheme();
  const { notice, dismissNotice } = useArmory();
  const [pastHero, setPastHero] = useState(false);
  const [armoryOpen, setArmoryOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [weaponId, setWeaponId] = useState<string | null>(null);
  const [infoTopic, setInfoTopic] = useState<InfoTopic | null>(null);
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById(`hero`);
      setPastHero(window.scrollY > (hero?.offsetHeight ?? 300));
    };
    window.addEventListener(`scroll`, onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener(`scroll`, onScroll);
  }, []);
  useEffect(() => {
    if (!isSectionId(sectionHash)) return;
    const frame = window.requestAnimationFrame(() => scrollToSection(sectionHash));
    return () => window.cancelAnimationFrame(frame);
  }, [sectionHash, pathname]);
  useEffect(() => {
    document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`, palette.background);
  }, [theme, palette.background]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(dismissNotice, 5000);
    return () => window.clearTimeout(timer);
  }, [notice, dismissNotice]);
  useEffect(() => {
    if (__DEV__ || !(`serviceWorker` in navigator)) return;
    navigator.serviceWorker.register(appUrl(`sw.js`)).catch(() => {});
  }, []);
  return { pastHero, armoryOpen, accountOpen, weaponId, infoTopic, setArmoryOpen, setAccountOpen, setWeaponId, setInfoTopic };
};
