import { assetUrl } from '../../shared/assets';
import type { WeaponModelId, EquipmentIllustration } from '../../types/types';

const representativeModels: Partial<Record<EquipmentIllustration, WeaponModelId>> = {
  guard: `longsword`,
  tassel: `longsword`,
  scabbard: `longsword`,
  cargo: `quadcopter`,
  camera: `quadcopter`,
  landing: `quadcopter`,
};
type PartThumbnailProps = { id: string; modelId?: WeaponModelId; illustration: EquipmentIllustration };
const PartThumbnail = ({ id, modelId, illustration }: PartThumbnailProps) => {
  if (illustration === `none`) return (
    <span id={id} className={`part-thumbnail part-thumbnail--none`} aria-hidden={true}>
      <svg id={`${id}-factory-icon`} className={`part-thumbnail__empty`} viewBox={`0 0 48 48`} focusable={false}>
        <circle id={`${id}-factory-circle`} cx={24} cy={24} r={18} fill={`none`} stroke={`currentColor`} strokeWidth={1.5} />
        <path id={`${id}-factory-mark`} d={`M16 24h16`} fill={`none`} stroke={`currentColor`} strokeWidth={1.5} />
      </svg>
    </span>
  );
  const representative = representativeModels[illustration] ?? `rifle`;
  const fallback = assetUrl(`attachments/${representative}-${illustration}.png`);
  return (
    <span id={id} className={`part-thumbnail part-thumbnail--${illustration}`} aria-hidden={true}>
      <img
        alt={``}
        width={400}
        height={280}
        loading={`lazy`}
        decoding={`async`}
        id={`${id}-image`}
        className={`part-thumbnail__image`}
        src={assetUrl(`attachments/${modelId ?? representative}-${illustration}.png`)}
        onError={event => { if (!event.currentTarget.src.endsWith(fallback)) event.currentTarget.src = fallback; }}
      />
    </span>
  );
};
export default PartThumbnail;
