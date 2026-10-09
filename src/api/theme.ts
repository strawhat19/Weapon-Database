import { storageNamespace } from '../shared/config';
import { isRecord } from '../shared/common/values';
import { defaultTheme } from '../styles/theme/theme';
import { StorageError, readStored, writeStored, withStorageLock, reportStorageError } from '../shared/common/storage';
import type { ThemeMode } from '../types/types';

const themeKey = `${storageNamespace}:theme`;
const readTheme = async (): Promise<ThemeMode> => {
  const stored = await readStored(themeKey);
  if (stored === undefined) return defaultTheme;
  if (isRecord(stored) && stored.schemaVersion === 1 && (stored.theme === `dark` || stored.theme === `light`)) return stored.theme;
  const error = new StorageError(`Stored Theme Preference Is Not Readable — Existing Data Has Been Preserved`);
  reportStorageError(error);
  throw error;
};
export const themeAPI = {
  getTheme: () => withStorageLock(themeKey, readTheme),
  setTheme: (theme: ThemeMode) => withStorageLock(themeKey, async () => {
    await readTheme();
    if (theme !== `dark` && theme !== `light`) throw new Error(`Choose A Valid Theme`);
    await writeStored(themeKey, { schemaVersion: 1, theme });
    return theme;
  }),
};
