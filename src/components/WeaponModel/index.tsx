import './styles.scss';
import Icon from '../Icon';
import WeaponLoader from '../WeaponLoader';
import { assetUrl } from '../../shared/assets';
import { useWeaponModel } from './useWeaponModel';
import type { SkinId, ThemeMode } from '../../types/types';

type WeaponModelProps = { skin: SkinId; title: string; theme: ThemeMode };

const WeaponModel = ({ skin, title, theme }: WeaponModelProps) => {
  const { status, viewport, resetView, autoRotation, toggleAutoRotation } = useWeaponModel(skin, theme);
  const ready = status === `ready`;

  return (
    <div id={`hero-weapon-model`} className={`weapon-model`} data-state={status} data-skin={skin}>
      <WeaponLoader active={status === `loading`} />
      <img
        draggable={false}
        alt={status === `fallback` ? `${title}, an armory design study` : ``}
        id={`hero-weapon-model-fallback`}
        className={`weapon-model__fallback`}
        src={assetUrl(`images/armory-rifle.png`)}
        aria-hidden={status !== `fallback`}
      />
      <div
        role={`group`}
        ref={viewport}
        aria-hidden={!ready}
        aria-busy={status === `loading`}
        tabIndex={ready ? 0 : -1}
        id={`hero-weapon-model-viewport`}
        className={`weapon-model__viewport`}
        aria-keyshortcuts={`ArrowUp ArrowDown ArrowLeft ArrowRight Q E R Home`}
        aria-describedby={`hero-weapon-model-instructions`}
        aria-label={`Interactive 3D model of ${title}`}
      />
      <p id={`hero-weapon-model-instructions`} className={`weapon-model__instructions`}>
        {`The model and surrounding ring rotate automatically. Use Pause to hold the view. Drag to rotate the model in any direction. Drag near the edge or twist with two fingers to roll. Use arrow keys to rotate, Q and E to roll, and Home or R to reset. Scroll outside the model to move down the page.`}
      </p>
      <div id={`hero-weapon-model-tools`} className={`weapon-model__tools`}>
        <span id={`hero-weapon-model-status`} className={`mono weapon-model__hint`} role={`status`}>
          {ready ? `360° / DRAG TO ROTATE` : status === `fallback` ? `IMAGE PREVIEW / 3D UNAVAILABLE` : ``}
        </span>
        {ready && (
          <button
            type={`button`}
            id={`hero-weapon-model-motion`}
            onClick={toggleAutoRotation}
            className={`weapon-model__motion`}
            title={autoRotation ? `Pause Animation` : `Resume Animation`}
            aria-label={autoRotation ? `Pause Model And Ring Animation` : `Resume Model And Ring Animation`}
          >
            <Icon filled name={autoRotation ? `pause` : `play`} size={12} />
          </button>
        )}
        {ready && (
          <button
            type={`button`}
            onClick={resetView}
            id={`hero-weapon-model-reset`}
            className={`weapon-model__reset`}
            aria-label={`Reset 3D Model View`}
            title={`Reset View (R)`}
          >
            <Icon name={`rotate`} size={14} />
            <span>{`Reset`}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default WeaponModel;
