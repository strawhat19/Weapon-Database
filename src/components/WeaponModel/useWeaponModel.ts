import { useEffect, useRef, useState } from 'react';
import type { WeaponViewer } from './createWeaponViewer';
import { getEquipmentKey } from '../../shared/catalog/equipment';
import type { WeaponModelId, SkinId, ThemeMode, ModelEquipment, EquipmentInspection } from '../../types/types';

export const useWeaponModel = (modelId: WeaponModelId, skin: SkinId, theme: ThemeMode, equipment: ModelEquipment, inspection?: EquipmentInspection) => {
  const viewport = useRef<HTMLDivElement>(null);
  const motion = useRef<boolean | undefined>(undefined);
  const viewer = useRef<WeaponViewer | null>(null);
  const appearance = useRef({ skin, theme, equipment });
  const [autoRotation, setAutoRotation] = useState(true);
  const [status, setStatus] = useState<`loading` | `ready` | `fallback`>(`loading`);
  const equipmentKey = getEquipmentKey(equipment);
  const inspectionId = inspection?.id;
  const inspectionSlot = inspection?.slot;
  useEffect(() => { appearance.current = { skin, theme, equipment }; }, [skin, theme, equipmentKey]);
  useEffect(() => {
    try { viewer.current?.setSkin(skin); viewer.current?.setTheme(theme); }
    catch { setStatus(`fallback`); }
  }, [skin, theme]);
  useEffect(() => {
    try { viewer.current?.setEquipment(appearance.current.equipment); }
    catch { setStatus(`fallback`); }
  }, [equipmentKey]);
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let cancelled = false;
    let instance: WeaponViewer | undefined;
    setStatus(`loading`);
    const initialize = async () => {
      try {
        const { createWeaponViewer } = await import('./createWeaponViewer');
        if (cancelled) return;
        const preferredMotion = motion.current;
        instance = createWeaponViewer(element, modelId, appearance.current.skin, appearance.current.theme, appearance.current.equipment, available => {
          if (!cancelled) setStatus(available ? `ready` : `fallback`);
        }, enabled => {
          if (!cancelled) { motion.current = enabled; setAutoRotation(enabled); }
        }, inspectionSlot && inspectionId ? { slot: inspectionSlot, id: inspectionId } : undefined);
        viewer.current = instance;
        if (preferredMotion !== undefined) instance.setAutoRotation(preferredMotion);
      } catch { if (!cancelled) setStatus(`fallback`); }
    };
    void initialize();
    return () => {
      cancelled = true;
      instance?.dispose();
      if (viewer.current === instance) viewer.current = null;
    };
  }, [modelId, inspectionSlot, inspectionId]);
  return {
    status, viewport, autoRotation,
    resetView: () => viewer.current?.resetView(),
    zoom: (direction: number) => viewer.current?.zoom(direction),
    toggleAutoRotation: () => viewer.current?.setAutoRotation(!autoRotation),
  };
};
