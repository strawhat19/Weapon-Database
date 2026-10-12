import './styles.scss';
import Icon from '../Icon';
import type { ReactNode } from 'react';
import WeaponLoader from '../WeaponLoader';
import { useWeaponModel } from './useWeaponModel';
import { getEquipmentKey } from '../../shared/catalog/equipment';
import type { WeaponModelId, SkinId, ThemeMode, ModelEquipment, EquipmentInspection } from '../../types/types';

type WeaponModelProps = {
  id?: string;
  skin: SkinId;
  title: string;
  image: string;
  showZoom?: boolean;
  theme: ThemeMode;
  fallback?: ReactNode;
  modelId: WeaponModelId;
  equipment: ModelEquipment;
  inspection?: EquipmentInspection;
};
const WeaponModel = ({ skin, title, image, theme, modelId, equipment, inspection, fallback, showZoom = false, id = `hero-weapon-model` }: WeaponModelProps) => {
  const { zoom, status, viewport, resetView, autoRotation, toggleAutoRotation } = useWeaponModel(modelId, skin, theme, equipment, inspection);
  const ready = status === `ready`;
  return (
    <div id={id} className={`weapon-model`} data-state={status} data-skin={skin} data-equipment={getEquipmentKey(equipment)} data-part={inspection?.id}>
      <WeaponLoader id={`${id}-loader`} active={status === `loading`} />
      {fallback ? <div id={`${id}-fallback`} className={`weapon-model__fallback weapon-model__fallback--part`} aria-hidden={status !== `fallback`}>{fallback}</div> : <img draggable={false} alt={status === `fallback` ? `${title}, an armory design study` : ``} id={`${id}-fallback`} className={`weapon-model__fallback`} src={image} aria-hidden={status !== `fallback`} />}
      <div
        role={`group`}
        ref={viewport}
        aria-hidden={!ready}
        aria-busy={status === `loading`}
        tabIndex={ready ? 0 : -1}
        id={`${id}-viewport`}
        className={`weapon-model__viewport`}
        aria-keyshortcuts={`ArrowUp ArrowDown ArrowLeft ArrowRight Q E R Home + -`}
        aria-describedby={`${id}-instructions`}
        aria-label={`Interactive 3D model of ${title}`}
      />
      <p id={`${id}-instructions`} className={`weapon-model__instructions`}>The model rotates automatically. Use Pause to hold the view. Drag to rotate, or twist with two fingers to roll. Use arrow keys to rotate, Q and E to roll, and Home or R to reset. Use plus and minus to zoom.</p>
      <div id={`${id}-tools`} className={`weapon-model__tools`}>
        <span id={`${id}-status`} className={`mono weapon-model__hint`} role={`status`}>{ready ? `360° / DRAG TO ROTATE` : status === `fallback` ? `IMAGE PREVIEW / 3D UNAVAILABLE` : ``}</span>
        {ready && <>
          <button type={`button`} id={`${id}-motion`} onClick={toggleAutoRotation} className={`weapon-model__motion`} title={autoRotation ? `Pause Animation` : `Resume Animation`} aria-label={autoRotation ? `Pause Model Animation` : `Resume Model Animation`}><Icon filled name={autoRotation ? `pause` : `play`} size={12} /></button>
          {showZoom && <>
            <button type={`button`} id={`${id}-zoom-out`} onClick={() => zoom(-1)} className={`weapon-model__zoom`} aria-label={`Zoom Out`} title={`Zoom Out (-)`}><span aria-hidden={true}>−</span></button>
            <button type={`button`} id={`${id}-zoom-in`} onClick={() => zoom(1)} className={`weapon-model__zoom`} aria-label={`Zoom In`} title={`Zoom In (+)`}><Icon name={`plus`} size={13} /></button>
          </>}
          <button type={`button`} onClick={resetView} id={`${id}-reset`} className={`weapon-model__reset`} aria-label={`Reset 3D Model View`} title={`Reset View (R)`}><Icon name={`rotate`} size={14} /><span>Reset</span></button>
        </>}
      </div>
    </div>
  );
};
export default WeaponModel;
