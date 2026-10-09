import { storageMode, storageDescription } from '../shared/common/storage';

export { themeAPI } from './theme';
export { catalogAPI } from './catalog';
export { armoryAPI, armoryStorageKey } from './armory';
export type { ArmorySnapshot } from './armory';
export const getRoutes = async () => [
  `getHealth`, `getStatus`, `getUsers`, `getVisits`, `getNotifications`,
  `catalog.getWeapons`, `catalog.getWeapon`,
  `armory.getSnapshot`, `armory.toggleSavedWeapon`, `armory.saveLoadout`, `armory.deleteLoadout`,
  `theme.getTheme`, `theme.setTheme`,
];
export const getHealth = async () => ({
  success: true,
  storageMode,
  title: `Weapon Database Local Service`,
  timestamp: new Date().toISOString(),
  message: `${storageDescription}. No Backend Connected`,
  operations: await getRoutes(),
});
export const getStatus = getHealth;
export const getUsers = async (): Promise<never[]> => [];
export const getVisits = async (): Promise<never[]> => [];
export const getNotifications = async (): Promise<never[]> => [];
