import './styles.scss';
import { assetUrl } from '../../shared/assets';

type WeaponLoaderProps = { active: boolean };

const WeaponLoader = ({ active }: WeaponLoaderProps) => (
  <div
    role={`status`}
    aria-live={`polite`}
    aria-atomic={true}
    aria-hidden={!active}
    id={`hero-weapon-loader`}
    data-active={active}
    className={`weapon-loader`}
  >
    <div id={`hero-weapon-loader-crest`} className={`weapon-loader__crest`} aria-hidden={true}>
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        id={`hero-weapon-loader-mark`}
        className={`weapon-loader__mark`}
        src={assetUrl(`brand/crest.svg`)}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        src={assetUrl(`brand/crest.svg`)}
        id={`hero-weapon-loader-slice-upper`}
        className={`weapon-loader__slice weapon-loader__slice--upper`}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        src={assetUrl(`brand/crest.svg`)}
        id={`hero-weapon-loader-slice-lower`}
        className={`weapon-loader__slice weapon-loader__slice--lower`}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        src={assetUrl(`brand/crest.svg`)}
        id={`hero-weapon-loader-slice-bands`}
        className={`weapon-loader__slice weapon-loader__slice--bands`}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        id={`hero-weapon-loader-scan`}
        className={`weapon-loader__scan`}
        src={assetUrl(`brand/crest.svg`)}
      />
    </div>
    <p id={`hero-weapon-loader-label`} className={`mono weapon-loader__label`}>{`Weapons Loading`}</p>
    <span id={`hero-weapon-loader-signal`} className={`weapon-loader__signal`} aria-hidden={true} />
  </div>
);

export default WeaponLoader;
