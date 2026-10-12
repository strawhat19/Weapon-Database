import { getCatalogWeapon, getCatalogWeapons } from '../shared/catalog';

export const catalogAPI = {
  getWeapons: async () => getCatalogWeapons(),
  getWeapon: async (id: string) => getCatalogWeapon(id),
};

