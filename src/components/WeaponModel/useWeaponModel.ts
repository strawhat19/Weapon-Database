import { useEffect, useRef, useState } from 'react';
import type { WeaponViewer } from './createWeaponViewer';
import type { SkinId, ThemeMode } from '../../types/types';

export const useWeaponModel = (skin: SkinId, theme: ThemeMode) => {
  const viewport = useRef<HTMLDivElement>(null);
  const viewer = useRef<WeaponViewer | null>(null);
  const appearance = useRef({ skin, theme });
  const [autoRotation, setAutoRotation] = useState(true);
  const [status, setStatus] = useState<`loading` | `ready` | `fallback`>(`loading`);

  useEffect(() => {
    appearance.current = { skin, theme };
    viewer.current?.setSkin(skin);
    viewer.current?.setTheme(theme);
  }, [skin, theme]);

  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    let cancelled = false;
    let instance: WeaponViewer | undefined;
    const initialize = async () => {
      try {
        const { createWeaponViewer } = await import('./createWeaponViewer');
        if (cancelled) return;
        instance = createWeaponViewer(element, appearance.current.skin, appearance.current.theme, available => {
          if (!cancelled) setStatus(available ? `ready` : `fallback`);
        }, enabled => {
          if (!cancelled) setAutoRotation(enabled);
        });
        viewer.current = instance;
      } catch {
        if (!cancelled) setStatus(`fallback`);
      }
    };
    void initialize();
    return () => {
      cancelled = true;
      instance?.dispose();
      if (viewer.current === instance) viewer.current = null;
    };
  }, []);

  return { status, viewport, autoRotation, resetView: () => viewer.current?.resetView(), toggleAutoRotation: () => viewer.current?.setAutoRotation(!autoRotation) };
};
