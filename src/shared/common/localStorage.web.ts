export const storageKind = `browser` as `browser` | `device`;
const browserStorage = () => {
  if (typeof window === `undefined`) throw new Error(`Browser Storage Is Not Available`);
  return window.localStorage;
};
export const getItem = async (key: string) => browserStorage().getItem(key);
export const setItem = async (key: string, value: string) => { browserStorage().setItem(key, value); };
