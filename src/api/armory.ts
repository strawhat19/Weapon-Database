import { storageNamespace } from '../shared/config';
import { Loadout, SavedWeapon } from '../shared/models';
import { isRecord, isText, isIsoDate } from '../shared/common/values';
import { createDataRecord, hasMatchingRecordId } from '../shared/common/ids';
import { getStoredEquipment, validOptionalSlots } from '../shared/catalog/equipment';
import { getCatalogWeapons, isSkinId, isOpticId, isAttachmentId } from '../shared/catalog';
import type { DataRecord, LoadoutDraft, LoadoutRecord, SavedWeaponRecord } from '../types/types';
import { StorageError, readStored, writeStored, withStorageLock, reportStorageError } from '../shared/common/storage';

export type ArmorySnapshot = {
  counter: number;
  schemaVersion: 1;
  loadouts: LoadoutRecord[];
  savedWeapons: SavedWeaponRecord[];
};
export const armoryStorageKey = `${storageNamespace}:armory`;
const emptySnapshot = (): ArmorySnapshot => ({ schemaVersion: 1, counter: 0, savedWeapons: [], loadouts: [] });
const validData = (value: unknown, type: `Loadout` | `SavedWeapon`): value is DataRecord & Record<string, unknown> =>
  isRecord(value) && isText(value.id) && isText(value.name) && value.name.length <= 80 &&
  typeof value.number === `number` && Number.isSafeInteger(value.number) && value.number > 0 &&
  isIsoDate(value.createdAt) && isIsoDate(value.updatedAt) && value.updatedAt >= value.createdAt &&
  hasMatchingRecordId(value.id, value.number, type);
const validSavedWeapon = (value: unknown): value is SavedWeaponRecord => validData(value, `SavedWeapon`) && isRecord(value) && isText(value.weaponId);
const validLoadout = (value: unknown): value is LoadoutRecord => validData(value, `Loadout`) && isRecord(value) && isText(value.weaponId) &&
  isSkinId(value.skin) &&
  isOpticId(value.optic) && isAttachmentId(value.attachment) &&
  validOptionalSlots(value);
const validSnapshot = (value: unknown): value is ArmorySnapshot => {
  if (!isRecord(value) || value.schemaVersion !== 1 || typeof value.counter !== `number` || !Number.isSafeInteger(value.counter) || value.counter < 0) return false;
  if (!Array.isArray(value.loadouts) || !Array.isArray(value.savedWeapons) || !value.loadouts.every(validLoadout) || !value.savedWeapons.every(validSavedWeapon)) return false;
  const records = [...value.loadouts, ...value.savedWeapons] as DataRecord[];
  return records.every(record => record.number <= (value.counter as number)) &&
    new Set(records.map(record => record.id)).size === records.length &&
    new Set(records.map(record => record.number)).size === records.length &&
    new Set((value.savedWeapons as SavedWeaponRecord[]).map(record => record.weaponId)).size === value.savedWeapons.length;
};
const readSnapshot = async (): Promise<ArmorySnapshot> => {
  const stored = await readStored(armoryStorageKey);
  if (stored === undefined) return emptySnapshot();
  if (validSnapshot(stored)) return stored;
  const error = new StorageError(`Saved Armory Data Is Not Readable — Existing Data Has Been Preserved`);
  reportStorageError(error);
  throw error;
};
const getWeapon = (id: string) => {
  const weapon = getCatalogWeapons().find(item => item.id === id);
  if (!weapon) throw new Error(`Choose A Weapon From The Catalog`);
  return weapon;
};
const normalizeDraft = (draft: LoadoutDraft): LoadoutDraft => {
  const name = typeof draft.name === `string` ? draft.name.trim() : ``;
  if (!name || name.length > 80) throw new Error(`Enter A Loadout Name Of 1–80 Characters`);
  getWeapon(draft.weaponId);
  if (!isSkinId(draft.skin) || !isOpticId(draft.optic) || !isAttachmentId(draft.attachment) || !validOptionalSlots(draft)) throw new Error(`Choose Valid Loadout Options`);
  return { name, skin: draft.skin, weaponId: draft.weaponId, ...getStoredEquipment(draft) };
};
const nextNumber = (snapshot: ArmorySnapshot) => {
  if (snapshot.counter >= Number.MAX_SAFE_INTEGER) throw new Error(`The Local Record Counter Is Full`);
  return snapshot.counter + 1;
};
const transaction = <T,>(action: (snapshot: ArmorySnapshot) => { snapshot: ArmorySnapshot; result: T }) =>
  withStorageLock(armoryStorageKey, async () => {
    const change = action(await readSnapshot());
    await writeStored(armoryStorageKey, change.snapshot);
    return change.result;
  });

export const armoryAPI = {
  getSnapshot: () => withStorageLock(armoryStorageKey, readSnapshot),
  toggleSavedWeapon: (weaponId: string) => transaction(snapshot => {
    const weapon = getWeapon(weaponId);
    const existing = snapshot.savedWeapons.find(record => record.weaponId === weaponId);
    const number = existing ? snapshot.counter : nextNumber(snapshot);
    const record = existing ? null : new SavedWeapon({ ...createDataRecord(`SavedWeapon`, `${weapon.title} ${weapon.subtitle}`, number), weaponId }).toRecord();
    const savedWeapons = existing ? snapshot.savedWeapons.filter(item => item.id !== existing.id) : [...snapshot.savedWeapons, record as SavedWeaponRecord];
    const updated = { ...snapshot, counter: number, savedWeapons };
    return { snapshot: updated, result: { snapshot: updated, saved: !existing } };
  }),
  saveLoadout: (draft: LoadoutDraft, editingId: string | null = null) => transaction(snapshot => {
    const values = normalizeDraft(draft);
    const existing = editingId ? snapshot.loadouts.find(record => record.id === editingId) : undefined;
    if (editingId && !existing) throw new Error(`Loadout Was Not Found — Refresh Before Saving`);
    const number = existing ? snapshot.counter : nextNumber(snapshot);
    const base = existing ? { ...existing, name: values.name, updatedAt: new Date().toISOString() } : createDataRecord(`Loadout`, values.name, number);
    const loadout = new Loadout({ ...base, ...values }).toRecord();
    const loadouts = existing ? snapshot.loadouts.map(record => record.id === editingId ? loadout : record) : [...snapshot.loadouts, loadout];
    const updated = { ...snapshot, counter: number, loadouts };
    return { snapshot: updated, result: { snapshot: updated, loadout } };
  }),
  deleteLoadout: (id: string) => transaction(snapshot => {
    if (!snapshot.loadouts.some(record => record.id === id)) throw new Error(`Loadout Was Not Found`);
    const updated = { ...snapshot, loadouts: snapshot.loadouts.filter(record => record.id !== id) };
    return { snapshot: updated, result: updated };
  }),
};
