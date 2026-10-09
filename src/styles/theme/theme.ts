import type { ThemeMode } from '../../types/types';

export type ThemeName = ThemeMode;
export const defaultTheme: ThemeMode = `light`;
export type ThemePalette = {
  red: string;
  text: string;
  green: string;
  olive: string;
  black: string;
  white: string;
  metal: string;
  steel: string;
  error: string;
  border: string;
  accent: string;
  shadow: string;
  surface: string;
  gunmetal: string;
  onAccent: string;
  textMuted: string;
  steelLight: string;
  surfaceAlt: string;
  background: string;
  accentMuted: string;
  backgroundAlt: string;
};
const shared = {
  red: `#E5302B`,
  green: `#7EB638`,
  olive: `#3D5844`,
  black: `#080A09`,
  white: `#F8F8F8`,
  metal: `#859398`,
  accent: `#7EB638`,
  gunmetal: `#565B64`,
  onAccent: `#080A09`,
  accentMuted: `#3D5844`,
};
export const themePalettes: Record<ThemeMode, ThemePalette> = {
  dark: {
    ...shared,
    text: `#F8F8F8`,
    error: `#F17975`,
    steel: `#303538`,
    border: `#454C50`,
    surface: `#202428`,
    textMuted: `#859398`,
    steelLight: `#586164`,
    surfaceAlt: `#17181A`,
    background: `#17181A`,
    backgroundAlt: `#101214`,
    shadow: `rgba(0, 0, 0, .32)`,
  },
  light: {
    ...shared,
    text: `#17181A`,
    accent: `#3D5844`,
    error: `#A51E1A`,
    steel: `#BCC3C4`,
    border: `#B5BDC0`,
    surface: `#F8F8F8`,
    textMuted: `#565B64`,
    steelLight: `#F8F8F8`,
    surfaceAlt: `#EDF0F2`,
    background: `#EDF0F2`,
    backgroundAlt: `#E2E7E9`,
    shadow: `rgba(21, 28, 29, .16)`,
  },
};
export const themeCssVariables = (palette: ThemePalette): Record<string, string> => ({
  ...Object.fromEntries(Object.entries(palette).flatMap(([name, value]) => {
    const kebab = name.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
    return [[`--color-${kebab}`, value], [`--${kebab}`, value]];
  })),
  '--muted': palette.textMuted,
  '--rule': palette.border,
  '--surface-deep': palette.backgroundAlt,
});
export type { ThemeMode } from '../../types/types';
