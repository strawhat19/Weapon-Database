import { getCatalogWeapons } from '../shared/catalog';

export const catalogAPI = {
  getWeapons: async () => getCatalogWeapons(),
  getWeapon: async (id: string) => getCatalogWeapons().find(weapon => weapon.id === id) ?? null,
};

