import { useLocalStorage } from '../config';
import { getItem, setItem, storageKind } from './localStorage';

export class StorageError extends Error {
  constructor(message: string) { super(message); this.name = `StorageError`; }
}
const session = new Map<string, string>();
const listeners = new Set<(error: string | null) => void>();
let latestError: string | null = null;
let queue: Promise<unknown> = Promise.resolve();
export const storageMode = useLocalStorage ? storageKind : `session`;
export const storageDescription = !useLocalStorage ? `Session Only — Changes Are Lost When The App Restarts` : storageKind === `browser` ? `Saved In This Browser` : `Saved On This Device`;
export const getStorageError = () => latestError;
export const reportStorageError = (error: unknown) => {
  latestError = error instanceof Error ? error.message : `Storage Could Not Be Updated`;
  listeners.forEach(listener => listener(latestError));
};
export const dismissStorageError = () => { latestError = null; listeners.forEach(listener => listener(null)); };
export const subscribeStorageErrors = (listener: (error: string | null) => void) => {
  listeners.add(listener);
  if (latestError) listener(latestError);
  return () => { listeners.delete(listener); };
};
export const readStored = async (key: string): Promise<unknown | undefined> => {
  try {
    const value = useLocalStorage ? await getItem(key) : session.get(key);
    return value == null ? undefined : JSON.parse(value) as unknown;
  } catch {
    const error = new StorageError(`Stored Data Could Not Be Read — Existing Data Has Been Preserved`);
    reportStorageError(error);
    throw error;
  }
};
export const writeStored = async (key: string, value: unknown) => {
  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) throw new Error(`A Storage Record Is Required`);
    if (useLocalStorage) await setItem(key, serialized);
    else session.set(key, serialized);
  } catch {
    const error = new StorageError(`Changes Could Not Be Saved — Check Available Storage And Browser Permissions`);
    reportStorageError(error);
    throw error;
  }
};
export const withStorageLock = <T,>(key: string, operation: () => Promise<T>): Promise<T> => {
  const run = async () => {
    const browserNavigator = typeof navigator === `undefined` ? undefined : navigator as unknown as { locks?: { request: <Value>(name: string, callback: () => Promise<Value>) => Promise<Value> } };
    if (useLocalStorage && browserNavigator?.locks?.request) return browserNavigator.locks.request(key, operation);
    return operation();
  };
  const result = queue.then(run, run);
  queue = result.catch(() => undefined);
  return result;
};
