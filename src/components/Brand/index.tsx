import { assetUrl } from '../../shared/assets';
import { scrollToSection } from '../../shared/routes';

type BrandProps = { id?: string; compact?: boolean; onNavigate?: () => void };

export default function Brand({ id = `header-brand`, compact = false, onNavigate }: BrandProps) {
  return <a
    id={id}
    href={`#hero`}
    aria-label={`Weapon Database Home`}
    className={`armory-brand ${compact ? `armory-brand--compact` : ``}`}
    onClick={event => { event.preventDefault(); onNavigate?.(); scrollToSection(`hero`); }}
  >
    <img id={`${id}-crest`} src={assetUrl(`brand/crest.svg`)} className={`armory-brand__crest`} alt={``} width={50} height={58} />
    <span id={`${id}-wordmark`} aria-hidden={true} className={`armory-brand__wordmark`} />
  </a>;
}
