import { getCatalogWeapons } from '../catalog';
export const catalog = getCatalogWeapons().map(item => ({ id: item.id, name: item.title, detail: item.subtitle, path: `/weapons` }));
export const productName = `Weapon Database`;
