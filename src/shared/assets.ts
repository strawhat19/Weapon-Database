import { appIconStyle } from './config';

export const assetUrl = (path: string) => {
  const base = process.env.EXPO_BASE_URL?.replace(/\/$/, ``) || ``;
  return `${base}/media/${path.replace(/^\/?(?:assets|media)\//, ``)}`;
};

const iconPath = {
  steel: `v1/02-crest-steel-silver`,
  transparent: `v1/01-crest-transparent`,
  'steel-crest': `v2/01-crest-steel-shield`,
}[appIconStyle];
export const appManifestUrl = {
  transparent: `./manifest.webmanifest`,
  steel: `./manifest-steel.webmanifest`,
  'steel-crest': `./manifest-steel-crest.webmanifest`,
}[appIconStyle];
export const appIconUrl = (size?: number) => assetUrl(`brand/app-icons/${iconPath}${size ? `-${size}.png` : `.svg`}`);
