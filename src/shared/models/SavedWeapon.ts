import { Data } from './Data';
import type { SavedWeaponRecord } from '../../types/types';

export class SavedWeapon extends Data {
  weaponId: string;
  constructor(record: SavedWeaponRecord) {
    super(record);
    this.weaponId = record.weaponId;
  }
  toRecord(): SavedWeaponRecord { return { ...super.toRecord(), weaponId: this.weaponId }; }
}

