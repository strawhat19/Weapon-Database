import type { ReactNode } from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import { themeAPI } from '../../api/theme';
import { errorMessage } from '../common/values';
import { dismissStorageError, subscribeStorageErrors } from '../common/storage';
import { defaultTheme, themePalettes, themeCssVariables } from '../../styles/theme/theme';
import type { ThemePalette } from '../../styles/theme/theme';
import type { ThemeMode } from '../../types/types';

export type ThemeContextValue = {
  theme: ThemeMode;
  hydrated: boolean;
  error: string | null;
  palette: ThemePalette;
  toggleTheme: () => void;
  dismissError: () => void;
};
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const mounted = useRef(false);
  const pending = useRef(false);
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme);
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    mounted.current = true;
    const unsubscribe = subscribeStorageErrors(message => { if (mounted.current) setError(message); });
    const hydrate = async () => {
      try { const stored = await themeAPI.getTheme(); if (mounted.current) setTheme(stored); }
      catch (failure) { if (mounted.current) setError(errorMessage(failure)); }
      finally { if (mounted.current) setHydrated(true); }
    };
    void hydrate();
    return () => { mounted.current = false; unsubscribe(); };
  }, []);
  useEffect(() => {
    if (typeof document === `undefined`) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    Object.entries(themeCssVariables(themePalettes[theme])).forEach(([name, value]) => document.documentElement.style.setProperty(name, value));
  }, [theme]);
  const toggleTheme = () => {
    if (!hydrated || pending.current) return;
    pending.current = true;
    const next = theme === `dark` ? `light` : `dark`;
    const persist = async () => {
      try { await themeAPI.setTheme(next); if (mounted.current) { setTheme(next); setError(null); } }
      catch (failure) { if (mounted.current) setError(errorMessage(failure)); }
      finally { pending.current = false; }
    };
    void persist();
  };
  const dismissError = () => { setError(null); dismissStorageError(); };
  return <ThemeContext.Provider value={{ theme, hydrated, error, toggleTheme, dismissError, palette: themePalettes[theme] }}>{children}</ThemeContext.Provider>;
};
