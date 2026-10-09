import type { DataRecord } from '../../types/types';

const uuid = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else bytes.forEach((_, index) => { bytes[index] = Math.floor(Math.random() * 256); });
  bytes[6] = (bytes[6] & 15) | 64;
  bytes[8] = (bytes[8] & 63) | 128;
  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, `0`)).join(``);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const createDataRecord = (type: `Loadout` | `SavedWeapon`, name: string, number: number): DataRecord => {
  const now = new Date();
  const normalizedName = name.trim();
  const safeName = normalizedName.replace(/[^a-zA-Z0-9]+/g, `_`).replace(/^_|_$/g, ``).slice(0, 40) || `Record`;
  const hour = now.getHours();
  const date = `${hour % 12 || 12}_${String(now.getMinutes()).padStart(2, `0`)}_${hour >= 12 ? `PM` : `AM`}_${now.getMonth() + 1}_${now.getDate()}_${String(now.getFullYear()).slice(-2)}`;
  const timestamp = now.toISOString();
  return { id: `${type}_${number}_${safeName}_${date}_${uuid()}`, number, name: normalizedName, createdAt: timestamp, updatedAt: timestamp };
};

export const hasMatchingRecordId = (id: string, number: number, type: `Loadout` | `SavedWeapon`) =>
  id.startsWith(`${type}_${number}_`) && /_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

