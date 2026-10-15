import AsyncStorage from '@react-native-async-storage/async-storage';
import { catalog } from './catalog';

export type LocalList = { id: string; name: string; items: string[] };
export type DeviceLibrary = { version: 1; favorites: string[]; lists: LocalList[]; displayName: string; collapsed: boolean };
export const deviceKey = `weapon-database:device-library:v1`;
export const emptyLibrary = (): DeviceLibrary => ({ version: 1, favorites: [], lists: [], displayName: ``, collapsed: false });
const known = new Set(catalog.map(item => item.id));
const ids = (value: unknown): value is string[] => Array.isArray(value) && value.length <= 2000 && value.every(id => typeof id === `string` && known.has(id)) && new Set(value).size === value.length;
const valid = (value: unknown): value is DeviceLibrary => {
  if (!value || typeof value !== `object`) return false;
  const data = value as DeviceLibrary;
  return data.version === 1 && ids(data.favorites) && typeof data.displayName === `string` && data.displayName.length <= 80 && typeof data.collapsed === `boolean`
    && Array.isArray(data.lists) && data.lists.length <= 100 && new Set(data.lists.map(list => list?.id)).size === data.lists.length
    && data.lists.every(list => list && typeof list.id === `string` && /^[a-zA-Z0-9_-]{1,100}$/.test(list.id) && typeof list.name === `string` && list.name.trim().length > 0 && list.name.length <= 80 && ids(list.items));
};
export const readLibrary = async (): Promise<DeviceLibrary> => {
  const raw = await AsyncStorage.getItem(deviceKey);
  if (raw === null) return emptyLibrary();
  const value: unknown = JSON.parse(raw);
  if (!valid(value)) throw new Error(`Saved library is unreadable. It has not been overwritten. Clear only this library to start again.`);
  return value;
};
export const saveLibrary = async (value: DeviceLibrary) => {
  if (!valid(value)) throw new Error(`Library exceeds supported limits or contains invalid records.`);
  await AsyncStorage.setItem(deviceKey, JSON.stringify(value));
};
export const clearLibrary = () => AsyncStorage.removeItem(deviceKey);
