import { Data } from './Data';
import { getStoredEquipment } from '../catalog/equipment';
import type { ModelEquipment, LoadoutRecord } from '../../types/types';

export class Loadout extends Data {
  weaponId: string;
  skin: LoadoutRecord[`skin`];
  equipment: ModelEquipment;
  constructor(record: LoadoutRecord) {
    super(record);
    this.skin = record.skin;
    this.weaponId = record.weaponId;
    this.equipment = getStoredEquipment(record);
  }
  toRecord(): LoadoutRecord {
    return { ...super.toRecord(), skin: this.skin, weaponId: this.weaponId, ...this.equipment };
  }
}
