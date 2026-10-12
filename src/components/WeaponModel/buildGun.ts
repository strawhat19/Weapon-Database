import { assembleSmgModel } from './buildSmg';
import { createRifleModel } from './buildRifle';
import { createGunGeometry } from './gunGeometry';
import { assemblePistolModel } from './buildPistol';
import { assembleShotgunModel } from './buildShotgun';
import { assembleMarksmanModel } from './buildMarksman';
import { assemblePrecisionModel } from './buildPrecision';
import type { GunModelId, SkinId, OpticId } from '../../types/types';

export const createGunModel = (model: GunModelId, skin: SkinId, optic: OpticId = model === `rifle` ? `precision` : `standard`, onSurfaceReady?: () => void): ReturnType<typeof createRifleModel> => {
  if (model === `rifle`) return createRifleModel(skin, optic);
  const assembly = createGunGeometry(model, onSurfaceReady);
  try {
    switch (model) {
      case `smg`: assembleSmgModel(assembly); break;
      case `pistol`: assemblePistolModel(assembly); break;
      case `shotgun`: assembleShotgunModel(assembly); break;
      case `precision`: assemblePrecisionModel(assembly); break;
      case `marksman`: assembleMarksmanModel(assembly); break;
    }
    return assembly.finish(skin);
  } catch (error) { assembly.dispose(); throw error; }
};
