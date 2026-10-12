import * as THREE from 'three';
import { assetUrl } from '../../shared/assets';
import type { GunModelId, SkinId } from '../../types/types';

type Reference = { image: string; skin: SkinId; width: number; height: number; pixelsPerUnit: number; originX: number; originY: number };
const references: Record<Exclude<GunModelId, `rifle` | `marksman`>, Reference> = {
  smg: { skin: `graphite`, width: 1774, height: 887, pixelsPerUnit: 475, originX: 991.5, originY: 436.75, image: `vx-9` },
  shotgun: { skin: `desert`, width: 2172, height: 724, pixelsPerUnit: 459.1112, originX: 1055.9558, originY: 447.358, image: `bastion-12` },
  precision: { skin: `arctic`, width: 1916, height: 821, pixelsPerUnit: 367, originX: 820.03, originY: 421.43, image: `sentinel-sr8` },
  pistol: { skin: `urban`, width: 1609, height: 978, pixelsPerUnit: 634, originX: 817, originY: 423, image: `kestrel-p9` },
};

export const createReferenceSurfaces = (model: Exclude<GunModelId, `rifle` | `marksman`>, onReady?: () => void) => {
  const reference = references[model];
  const materials = new Map<THREE.MeshStandardMaterial, THREE.MeshStandardMaterial>();
  let currentSkin = reference.skin;
  let available = true;
  let disposed = false;
  const applySkin = () => materials.forEach((surface, base) => {
    const previousMap = surface.map;
    const matched = available && currentSkin === reference.skin;
    surface.map = matched ? texture : base.map;
    surface.color.copy(base.color);
    surface.roughness = base.roughness;
    surface.metalness = base.metalness;
    surface.alphaTest = matched ? .4 : base.alphaTest;
    if (matched) { surface.color.setRGB(.42, .42, .42); surface.metalness = Math.min(base.metalness, .18); }
    if (previousMap !== surface.map) surface.needsUpdate = true;
  });
  const texture = new THREE.TextureLoader().load(assetUrl(`images/${reference.image}-studio.webp`), () => {
    if (disposed) { texture.dispose(); return; }
    onReady?.();
  }, undefined, () => {
    if (disposed) return;
    available = false;
    applySkin();
    onReady?.();
  });
  texture.channel = 2;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.name = `${reference.image} Reference Surface`;
  const material = (base: THREE.MeshStandardMaterial) => {
    const existing = materials.get(base);
    if (existing) return existing;
    const surface = base.clone();
    surface.name = `${reference.image} ${base.name || `Side`} Reference Material`;
    materials.set(base, surface);
    return surface;
  };
  const prepare = (geometry: THREE.BufferGeometry) => {
    const positions = geometry.getAttribute(`position`);
    const uv = new THREE.Float32BufferAttribute(new Float32Array(positions.count * 2), 2);
    const grain = uv.clone();
    const pattern = uv.clone();
    const span = Math.max(reference.width, reference.height) / reference.pixelsPerUnit;
    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index), y = positions.getY(index);
      uv.setXY(index, (reference.originX + x * reference.pixelsPerUnit) / reference.width, 1 - (reference.originY - y * reference.pixelsPerUnit) / reference.height);
      pattern.setXY(index, x / span, y / span);
      grain.setXY(index, x, y);
    }
    geometry.setAttribute(`uv`, pattern);
    geometry.setAttribute(`uv1`, grain);
    geometry.setAttribute(`uv2`, uv);
  };
  const setSkin = (skin: SkinId) => { if (!disposed) { currentSkin = skin; applySkin(); } };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    texture.dispose();
    materials.forEach(surface => surface.dispose());
    materials.clear();
  };
  return { material, prepare, setSkin, dispose };
};
