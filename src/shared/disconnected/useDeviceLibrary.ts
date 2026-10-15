import { useEffect, useRef, useState } from 'react';
import { clearLibrary, emptyLibrary, readLibrary, saveLibrary, type DeviceLibrary } from './service';

export const useDeviceLibrary = () => {
  const [data, setData] = useState<DeviceLibrary>(emptyLibrary);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(``);
  const active = useRef(true);
  const saving = useRef(false);
  useEffect(() => {
    active.current = true;
    readLibrary().then(value => { if (active.current) { setData(value); setReady(true); } }).catch(failure => { if (active.current) setError(failure instanceof Error ? failure.message : `Device storage unavailable`); });
    return () => { active.current = false; };
  }, []);
  const update = async (next: DeviceLibrary) => {
    if (!ready || saving.current) return;
    saving.current = true; setBusy(true); setError(``);
    try { const preferences = { ...next, favorites: [] }; await saveLibrary(preferences); if (active.current) setData(preferences); }
    catch { if (active.current) setError(`Could not save to this device. Your last confirmed library is unchanged.`); }
    finally { saving.current = false; if (active.current) setBusy(false); }
  };
  const clear = async () => {
    if (saving.current) return;
    saving.current = true; setBusy(true);
    try { await clearLibrary(); if (active.current) { setData(emptyLibrary()); setReady(true); setError(``); } }
    catch { if (active.current) setError(`Could not clear this device library.`); }
    finally { saving.current = false; if (active.current) setBusy(false); }
  };
  return { data, ready, busy, error, update, clear };
};
