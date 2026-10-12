import './styles.scss';
import { assetUrl } from '../../shared/assets';

type WeaponLoaderProps = { active: boolean; id?: string };

const WeaponLoader = ({ active, id = `hero-weapon-loader` }: WeaponLoaderProps) => (
  <div
    role={`status`}
    aria-live={`polite`}
    aria-atomic={true}
    aria-hidden={!active}
    id={id}
    data-active={active}
    className={`weapon-loader`}
  >
    <div id={`${id}-crest`} className={`weapon-loader__crest`} aria-hidden={true}>
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        id={`${id}-mark`}
        className={`weapon-loader__mark`}
        src={assetUrl(`brand/crest.svg`)}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        src={assetUrl(`brand/crest.svg`)}
        id={`${id}-slice-upper`}
        className={`weapon-loader__slice weapon-loader__slice--upper`}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        src={assetUrl(`brand/crest.svg`)}
        id={`${id}-slice-lower`}
        className={`weapon-loader__slice weapon-loader__slice--lower`}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        src={assetUrl(`brand/crest.svg`)}
        id={`${id}-slice-bands`}
        className={`weapon-loader__slice weapon-loader__slice--bands`}
      />
      <img
        alt={``}
        width={176}
        height={204}
        draggable={false}
        id={`${id}-scan`}
        className={`weapon-loader__scan`}
        src={assetUrl(`brand/crest.svg`)}
      />
    </div>
    <p id={`${id}-label`} className={`mono weapon-loader__label`}>{`Weapons Loading`}</p>
    <span id={`${id}-signal`} className={`weapon-loader__signal`} aria-hidden={true} />
  </div>
);

export default WeaponLoader;
