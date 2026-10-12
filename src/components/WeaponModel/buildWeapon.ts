import { createGunModel } from './buildGun';
import { Box3, Group, Vector3 } from 'three';
import { assembleGunMods } from './buildGunMods';
import { assembleCrossbow } from './buildCrossbow';
import { createModelAssembly } from './modelAssembly';
import { assembleSwordDrone } from './buildSwordDrone';
import { assembleGunEquipment } from './buildGunEquipment';
import { assembleDisplayEquipment } from './buildDisplayEquipment';
import { getEffectiveEquipment, getEquipmentDefaults } from '../../shared/catalog/equipment';
import type { GunModelId, SkinId, ModelEquipment, WeaponModelId, EquipmentInspection } from '../../types/types';

const gunModels = new Set<WeaponModelId>([`rifle`, `smg`, `shotgun`, `precision`, `pistol`]);
const isGunModel = (model: WeaponModelId): model is GunModelId => gunModels.has(model);
const createBaseModel = (model: WeaponModelId, skin: SkinId): ReturnType<typeof createGunModel> => {
  if (isGunModel(model)) return createGunModel(model, skin, `standard`, `none`);
  const assembly = createModelAssembly(model);
  try {
    switch (model) {
      case `longsword`: case `katana`: case `saber`: case `quadcopter`: case `fixedwing`: assembleSwordDrone(model, assembly); break;
      case `recurvebow`: case `compoundbow`: assembleCrossbow(model, assembly, `standard`); break;
      default: throw new Error(`Unknown Weapon Presentation Model`);
    }
    return assembly.finish(skin);
  } catch (error) { assembly.dispose(); throw error; }
};
const assembleParts = (model: WeaponModelId, selected: ModelEquipment, assembly: ReturnType<typeof createModelAssembly>, includeOptic = true) => {
  if (isGunModel(model) || model === `recurvebow` || model === `compoundbow`) {
    if (includeOptic) assembleGunEquipment(model, selected.optic, `none`, assembly);
    assembleGunEquipment(model, null, selected.underbarrel, assembly);
    assembleGunEquipment(model, null, selected.rail, assembly);
    if (selected.muzzle === `suppressor`) assembleGunEquipment(model, null, `suppressor`, assembly);
    if (isGunModel(model)) assembleGunMods(model, selected.stock, selected.magazine, selected.muzzle, assembly);
  } else assembleDisplayEquipment(model, selected.customization, assembly);
};
export const createPartModel = (model: WeaponModelId, skin: SkinId, inspection: EquipmentInspection): ReturnType<typeof createGunModel> => {
  const selected = getEffectiveEquipment(model, { optic: `standard`, attachment: `none`, [inspection.slot]: inspection.id });
  const assembly = createModelAssembly(model);
  try {
    if (inspection.slot === `optic` && (isGunModel(model) || model === `recurvebow` || model === `compoundbow`)) assembleGunEquipment(model, selected.optic, `none`, assembly, true);
    else assembleParts(model, selected, assembly, false);
    if (!assembly.hasGeometry()) throw new Error(`No Attachment Geometry Available`);
    return assembly.finish(skin);
  } catch (error) { assembly.dispose(); throw error; }
};
export const createWeaponModel = (model: WeaponModelId, skin: SkinId, equipment: ModelEquipment = getEquipmentDefaults(model)): ReturnType<typeof createGunModel> => {
  const selected = getEffectiveEquipment(model, equipment);
  const base = createBaseModel(model, skin);
  const assembly = createModelAssembly(model);
  try {
    assembleParts(model, selected, assembly);
    if (!assembly.hasGeometry()) { assembly.dispose(); return base; }
    const extra = assembly.finish(skin);
    extra.object.position.copy(extra.origin).sub(base.origin);
    const object = new Group();
    object.name = `${model.toUpperCase()} Configured Presentation Model`;
    object.add(base.object, extra.object);
    const bounds = new Box3().setFromObject(object);
    const center = bounds.getCenter(new Vector3());
    object.position.copy(center).multiplyScalar(-1);
    const framingPoints: Vector3[] = [];
    for (const x of [bounds.min.x, bounds.max.x]) for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) framingPoints.push(new Vector3(x, y, z).sub(center));
    }
    const setSkin = (next: SkinId) => { base.setSkin(next); extra.setSkin(next); };
    const dispose = () => { base.dispose(); extra.dispose(); framingPoints.length = 0; object.clear(); };
    return { object, dispose, setSkin, framingPoints, origin: base.origin.clone().add(center) };
  } catch (error) { base.dispose(); assembly.dispose(); throw error; }
};
