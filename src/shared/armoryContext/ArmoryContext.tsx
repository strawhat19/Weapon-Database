import { catalogAPI } from '../../api/catalog';
import { errorMessage } from '../common/values';
import type { ArmorySnapshot } from '../../api/armory';
import { getStoredEquipment } from '../catalog/equipment';
import { armoryAPI, armoryStorageKey } from '../../api/armory';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { createContext, useEffect, useRef, useState } from 'react';
import { defaultWeaponId, getEquipmentDefaults } from '../catalog';
import type { Category, Weapon, LoadoutDraft, LoadoutRecord } from '../../types/types';
import { storageMode, getStorageError, storageDescription, dismissStorageError, subscribeStorageErrors } from '../common/storage';

export type ArmoryContextValue = {
  query: string;
  busy: boolean;
  loading: boolean;
  weapons: Weapon[];
  category: Category;
  error: string | null;
  notice: string | null;
  draft: LoadoutDraft;
  loadouts: LoadoutRecord[];
  savedWeaponIds: string[];
  storageMode: typeof storageMode;
  storageDescription: string;
  editingLoadoutId: string | null;
  resetDraft: () => void;
  dismissError: () => void;
  dismissNotice: () => void;
  saveDraft: () => Promise<boolean>;
  editLoadout: (id: string) => void;
  selectWeaponForBuild: (id: string) => void;
  deleteLoadout: (id: string) => Promise<void>;
  toggleSavedWeapon: (id: string) => Promise<void>;
  setQuery: Dispatch<SetStateAction<string>>;
  setCategory: Dispatch<SetStateAction<Category>>;
  setDraft: Dispatch<SetStateAction<LoadoutDraft>>;
};
export const createDefaultDraft = (): LoadoutDraft => ({ name: `ARX-27 Loadout`, weaponId: defaultWeaponId, skin: `olive`, ...getEquipmentDefaults(`rifle`) });
export const ArmoryContext = createContext<ArmoryContextValue | undefined>(undefined);

export const ArmoryProvider = ({ children }: { children: ReactNode }) => {
  const mounted = useRef(false);
  const ready = useRef(false);
  const mutating = useRef(false);
  const [query, setQuery] = useState(``);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [category, setCategory] = useState<Category>(`all`);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loadouts, setLoadouts] = useState<LoadoutRecord[]>([]);
  const [savedWeaponIds, setSavedWeaponIds] = useState<string[]>([]);
  const [draft, setDraft] = useState<LoadoutDraft>(createDefaultDraft);
  const [editingLoadoutId, setEditingLoadoutId] = useState<string | null>(null);
  const applySnapshot = (snapshot: ArmorySnapshot) => {
    setLoadouts(snapshot.loadouts);
    setSavedWeaponIds(snapshot.savedWeapons.map(record => record.weaponId));
  };
  useEffect(() => {
    mounted.current = true;
    const unsubscribe = subscribeStorageErrors(message => { if (mounted.current) setError(message); });
    const hydrate = async () => {
      try {
        const catalog = await catalogAPI.getWeapons();
        if (mounted.current) setWeapons(catalog);
        const snapshot = await armoryAPI.getSnapshot();
        if (mounted.current) { applySnapshot(snapshot); ready.current = true; }
      } catch (failure) {
        if (mounted.current) setError(errorMessage(failure));
      } finally {
        if (mounted.current) setLoading(false);
      }
    };
    void hydrate();
    const refresh = (event: StorageEvent) => { if (event.key === armoryStorageKey || event.key === null) void hydrate(); };
    if (typeof window !== `undefined`) window.addEventListener(`storage`, refresh);
    return () => {
      mounted.current = false;
      unsubscribe();
      if (typeof window !== `undefined`) window.removeEventListener(`storage`, refresh);
    };
  }, []);
  const runMutation = async <T,>(operation: () => Promise<T>, success: (result: T) => void): Promise<boolean> => {
    if (!ready.current) { setError(`Your Local Armory Is Not Ready — Stored Data Has Been Preserved`); return false; }
    if (mutating.current) return false;
    mutating.current = true;
    setBusy(true);
    setError(getStorageError());
    setNotice(null);
    try {
      const result = await operation();
      if (mounted.current) success(result);
      return true;
    } catch (failure) {
      if (mounted.current) setError(errorMessage(failure));
      return false;
    } finally {
      mutating.current = false;
      if (mounted.current) setBusy(false);
    }
  };
  const resetDraft = () => { setDraft(createDefaultDraft()); setEditingLoadoutId(null); };
  const toggleSavedWeapon = async (id: string): Promise<void> => {
    await runMutation(() => armoryAPI.toggleSavedWeapon(id), result => {
      applySnapshot(result.snapshot);
      setNotice(result.saved ? `Weapon Saved` : `Weapon Removed From Saved`);
    });
  };
  const saveDraft = () => runMutation(() => armoryAPI.saveLoadout(draft, editingLoadoutId), result => {
    applySnapshot(result.snapshot);
    setDraft({ name: result.loadout.name, weaponId: result.loadout.weaponId, skin: result.loadout.skin, ...getStoredEquipment(result.loadout) });
    setEditingLoadoutId(result.loadout.id);
    setNotice(editingLoadoutId ? `Loadout Updated` : `Loadout Saved`);
  });
  const deleteLoadout = async (id: string): Promise<void> => {
    await runMutation(() => armoryAPI.deleteLoadout(id), snapshot => {
      applySnapshot(snapshot);
      if (editingLoadoutId === id) resetDraft();
      setNotice(`Loadout Deleted`);
    });
  };
  const editLoadout = (id: string) => {
    const record = loadouts.find(item => item.id === id);
    if (!record) { setError(`Loadout Was Not Found`); return; }
    setDraft({ name: record.name, weaponId: record.weaponId, skin: record.skin, ...getStoredEquipment(record) });
    setEditingLoadoutId(id);
    setNotice(`Editing Loadout`);
  };
  const selectWeaponForBuild = (id: string) => {
    const weapon = weapons.find(item => item.id === id);
    if (!weapon) { setError(`Choose A Weapon From The Catalog`); return; }
    setDraft({ ...createDefaultDraft(), name: `${weapon.title} Loadout`, weaponId: id, skin: weapon.defaultSkin ?? `olive`, ...getEquipmentDefaults(weapon.modelId) });
    setEditingLoadoutId(null);
  };
  const dismissError = () => { setError(null); dismissStorageError(); };
  const value: ArmoryContextValue = {
    query, busy, draft, error, notice, weapons, loading, category, loadouts,
    setQuery, setDraft, setCategory, savedWeaponIds, editingLoadoutId,
    resetDraft, saveDraft, editLoadout, deleteLoadout, toggleSavedWeapon,
    dismissError, selectWeaponForBuild, storageMode, storageDescription,
    dismissNotice: () => setNotice(null),
  };
  return <ArmoryContext.Provider value={value}>{children}</ArmoryContext.Provider>;
};
