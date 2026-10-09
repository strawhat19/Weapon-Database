import { Data } from './Data';
import type { SkinId, OpticId, AttachmentId, LoadoutRecord } from '../../types/types';

export class Loadout extends Data {
  skin: SkinId;
  optic: OpticId;
  weaponId: string;
  attachment: AttachmentId;
  constructor(record: LoadoutRecord) {
    super(record);
    this.skin = record.skin;
    this.optic = record.optic;
    this.weaponId = record.weaponId;
    this.attachment = record.attachment;
  }
  toRecord(): LoadoutRecord {
    return { ...super.toRecord(), skin: this.skin, optic: this.optic, weaponId: this.weaponId, attachment: this.attachment };
  }
}

