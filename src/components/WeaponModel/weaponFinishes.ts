import type { SkinId } from '../../types/types';
import type { Mesh, MeshStandardMaterial, Object3D } from 'three';
import { Box3, Vector3, CanvasTexture, RepeatWrapping, SRGBColorSpace } from 'three';
import { weaponFinishes, type WeaponFinish } from '../../shared/catalog/finishes';

const createPatternTexture = (finish: WeaponFinish, studio: boolean) => {
  const size = 256;
  const canvas = document.createElement(`canvas`);
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext(`2d`);
  if (!context) throw new Error(`Unable To Create Weapon Finish Canvas`);
  const palette = finish.palette?.length ? finish.palette : [finish.color, `#484b42`, `#b0aa8f`];
  let seed = [...finish.id].reduce((value, character) => Math.imul(value, 31) + character.charCodeAt(0), 2166136261) >>> 0;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const wrap = (draw: (offsetX: number, offsetY: number) => void) => {
    for (const offsetX of [-size, 0, size]) {
      for (const offsetY of [-size, 0, size]) draw(offsetX, offsetY);
    }
  };
  context.fillStyle = palette[0] ?? finish.color;
  context.fillRect(0, 0, size, size);
  if (finish.pattern === `blotches`) {
    for (let patch = 0; patch < (studio ? 110 : 58); patch += 1) {
      const x = random() * size;
      const y = random() * size;
      const radiusX = studio ? 12 + random() * 28 : 18 + random() * 35;
      const radiusY = studio ? 9 + random() * 21 : 14 + random() * 27;
      const points = Array.from({ length: 10 }, (_, point) => {
        const angle = point * Math.PI / 5;
        const variation = 0.65 + random() * 0.5;
        return [Math.cos(angle) * radiusX * variation, Math.sin(angle) * radiusY * variation] as const;
      });
      context.fillStyle = palette[1 + patch % Math.max(1, palette.length - 1)] ?? finish.color;
      wrap((offsetX, offsetY) => {
        context.beginPath();
        if (studio) {
          const first = points[0];
          const last = points[points.length - 1];
          context.moveTo(x + offsetX + (first[0] + last[0]) / 2, y + offsetY + (first[1] + last[1]) / 2);
          points.forEach(([pointX, pointY], point) => {
            const next = points[(point + 1) % points.length];
            context.quadraticCurveTo(x + offsetX + pointX, y + offsetY + pointY, x + offsetX + (pointX + next[0]) / 2, y + offsetY + (pointY + next[1]) / 2);
          });
        } else points.forEach(([pointX, pointY], point) => {
          const drawX = x + offsetX + pointX;
          const drawY = y + offsetY + pointY;
          if (!point) context.moveTo(drawX, drawY);
          else context.lineTo(drawX, drawY);
        });
        context.closePath();
        context.fill();
      });
    }
  }
  if (finish.pattern === `digital`) {
    const cell = 16;
    for (let cluster = 0; cluster < 72; cluster += 1) {
      const x = Math.floor(random() * 16) * cell;
      const y = Math.floor(random() * 16) * cell;
      const width = (1 + Math.floor(random() * 3)) * cell;
      const height = (1 + Math.floor(random() * 2)) * cell;
      context.fillStyle = palette[1 + cluster % Math.max(1, palette.length - 1)] ?? finish.color;
      wrap((offsetX, offsetY) => {
        context.fillRect(x + offsetX, y + offsetY, width, height);
        if (!(cluster % 3)) context.fillRect(x + offsetX + width, y + offsetY + cell, cell, cell);
      });
    }
  }
  if (finish.pattern === `stripes`) {
    for (let stripe = -8; stripe < 13; stripe += 1) {
      const phase = stripe * Math.PI / 2;
      const points = Array.from({ length: 25 }, (_, point) => {
        const y = point * size / 24;
        const progress = y / size;
        return {
          y,
          width: 8 + Math.sin(progress * Math.PI * 4 + phase) * 4,
          x: stripe * 32 + y * 0.5 + Math.sin(progress * Math.PI * 2 + phase) * 10,
        };
      });
      context.fillStyle = palette[1 + Math.abs(stripe) % 2] ?? palette[1] ?? finish.color;
      context.beginPath();
      points.forEach((point, index) => {
        if (!index) context.moveTo(point.x - point.width, point.y);
        else context.lineTo(point.x - point.width, point.y);
      });
      [...points].reverse().forEach(point => context.lineTo(point.x + point.width, point.y));
      context.closePath();
      context.fill();
    }
  }
  if (studio) {
    const grain = context.getImageData(0, 0, size, size);
    for (let pixel = 0; pixel < grain.data.length; pixel += 4) {
      const variation = .97 + random() * .06;
      for (let channel = 0; channel < 3; channel += 1) grain.data[pixel + channel] *= variation;
    }
    context.putImageData(grain, 0, 0);
  }
  const texture = new CanvasTexture(canvas);
  texture.name = `Weapon Finish ${finish.id}`;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.repeat.set(2, 2);
  return texture;
};

export const createWeaponFinish = (materials: readonly MeshStandardMaterial[], object?: Object3D, { studio = false }: { studio?: boolean } = {}) => {
  const textures = new Map<SkinId, CanvasTexture>();
  const surfaces = materials.map(material => ({ roughness: material.roughness, metalness: material.metalness }));
  let projected = false;
  let disposed = false;
  const prepareProjection = () => {
    if (!object || projected) return;
    const size = new Box3().setFromObject(object).getSize(new Vector3());
    const density = 1 / Math.max(size.x, size.y, size.z, 0.001);
    object.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh || Array.isArray(mesh.material) || !materials.includes(mesh.material as MeshStandardMaterial)) return;
      const positions = mesh.geometry.getAttribute(`position`);
      const normals = mesh.geometry.getAttribute(`normal`);
      const uv = mesh.geometry.getAttribute(`uv`);
      if (!positions || !normals || !uv) return;
      for (let triangle = 0; triangle < positions.count; triangle += 3) {
        const normalX = Math.abs(normals.getX(triangle) + normals.getX(triangle + 1) + normals.getX(triangle + 2));
        const normalY = Math.abs(normals.getY(triangle) + normals.getY(triangle + 1) + normals.getY(triangle + 2));
        const normalZ = Math.abs(normals.getZ(triangle) + normals.getZ(triangle + 1) + normals.getZ(triangle + 2));
        const projectX = normalX >= normalY && normalX >= normalZ;
        const projectY = !projectX && normalY >= normalZ;
        for (let vertex = triangle; vertex < triangle + 3; vertex += 1) {
          const u = projectX ? positions.getZ(vertex) : positions.getX(vertex);
          const v = projectY ? positions.getZ(vertex) : positions.getY(vertex);
          uv.setXY(vertex, u * density, v * density);
        }
      }
      uv.needsUpdate = true;
    });
    projected = true;
  };
  const setSkin = (skin: SkinId) => {
    if (disposed) return;
    const finish = weaponFinishes.find(item => item.id === skin);
    if (!finish) return;
    let texture: CanvasTexture | null = null;
    if (finish.pattern) {
      prepareProjection();
      texture = textures.get(skin) ?? createPatternTexture(finish, studio);
      textures.set(skin, texture);
    }
    materials.forEach((material, index) => {
      const mapPresenceChanged = Boolean(material.map) !== Boolean(texture);
      material.map = texture;
      material.color.set(texture ? `#ffffff` : finish.color);
      if (index) material.color.multiplyScalar(studio ? .86 : .78);
      material.roughness = texture ? studio ? .68 : .82 : surfaces[index].roughness;
      material.metalness = texture ? studio ? .24 : .14 : surfaces[index].metalness;
      if (mapPresenceChanged) material.needsUpdate = true;
    });
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    const ownedTextures = new Set(textures.values());
    materials.forEach(material => {
      if (!material.map || !ownedTextures.has(material.map as CanvasTexture)) return;
      material.map = null;
      material.needsUpdate = true;
    });
    textures.forEach(texture => texture.dispose());
    textures.clear();
  };
  return { setSkin, dispose };
};
