import type { Mesh, Object3D, MeshStandardMaterial } from 'three';
import { DataTexture, RGBAFormat, RepeatWrapping, LinearFilter, Float32BufferAttribute, LinearMipmapLinearFilter } from 'three';

type SurfaceKind = `paint` | `metal` | `rubber`;
type Surface = { material: MeshStandardMaterial; kind: SurfaceKind };
const profiles = {
  paint: { frequency: 14, bumpScale: .0035, roughness: 237 },
  metal: { frequency: 18, bumpScale: .0012, roughness: 232 },
  rubber: { frequency: 5, bumpScale: .006, roughness: 243 },
};

const createSurfaceMaps = (kind: SurfaceKind) => {
  const size = 128;
  const height = new Uint8Array(size * size * 4);
  const roughness = new Uint8Array(height.length);
  const noise = (x: number, y: number) => {
    let value = Math.imul(x + 29, 374761393) ^ Math.imul(y + 71, 668265263);
    value = Math.imul(value ^ value >>> 13, 1274126177);
    return ((value ^ value >>> 16) >>> 0) / 4294967295;
  };
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const grain = noise(x, y);
    const brushing = noise(0, y);
    const variation = kind === `metal` ? brushing * .65 + grain * .35 : grain;
    const raised = kind === `rubber` ? Math.pow(grain, 2) : variation;
    const index = (y * size + x) * 4;
    const depth = Math.round(112 + raised * 32);
    const matte = Math.min(255, Math.round(profiles[kind].roughness + variation * 15));
    height.set([depth, depth, depth, 255], index);
    roughness.set([matte, matte, matte, 255], index);
  }
  const texture = (pixels: Uint8Array, label: string) => {
    const map = new DataTexture(pixels, size, size, RGBAFormat);
    map.name = `${kind} ${label}`;
    map.channel = 1;
    map.wrapS = RepeatWrapping;
    map.wrapT = RepeatWrapping;
    map.magFilter = LinearFilter;
    map.minFilter = LinearMipmapLinearFilter;
    map.generateMipmaps = true;
    map.repeat.set(profiles[kind].frequency, profiles[kind].frequency);
    map.needsUpdate = true;
    return map;
  };
  return { bump: texture(height, `Surface Grain`), roughness: texture(roughness, `Surface Roughness`) };
};

export const createSurfaceDetail = (surfaces: readonly Surface[], object: Object3D) => {
  const maps = new Map<SurfaceKind, ReturnType<typeof createSurfaceMaps>>();
  const materials = new Set(surfaces.map(surface => surface.material));
  let prepared = false;
  let disposed = false;
  surfaces.forEach(({ kind, material }) => {
    const detail = maps.get(kind) ?? createSurfaceMaps(kind);
    maps.set(kind, detail);
    material.bumpMap = detail.bump;
    material.roughnessMap = detail.roughness;
    material.bumpScale = profiles[kind].bumpScale;
    material.needsUpdate = true;
  });
  const prepare = () => {
    if (disposed || prepared) return;
    object.traverse(part => {
      const mesh = part as Mesh;
      if (!mesh.isMesh || Array.isArray(mesh.material) || !materials.has(mesh.material as MeshStandardMaterial)) return;
      const positions = mesh.geometry.getAttribute(`position`);
      const normals = mesh.geometry.getAttribute(`normal`);
      if (!positions || !normals) return;
      const uv = new Float32BufferAttribute(new Float32Array(positions.count * 2), 2);
      for (let triangle = 0; triangle < positions.count; triangle += 3) {
        const normalX = Math.abs(normals.getX(triangle) + normals.getX(triangle + 1) + normals.getX(triangle + 2));
        const normalY = Math.abs(normals.getY(triangle) + normals.getY(triangle + 1) + normals.getY(triangle + 2));
        const normalZ = Math.abs(normals.getZ(triangle) + normals.getZ(triangle + 1) + normals.getZ(triangle + 2));
        const projectX = normalX >= normalY && normalX >= normalZ;
        const projectY = !projectX && normalY >= normalZ;
        for (let vertex = triangle; vertex < triangle + 3; vertex += 1) {
          uv.setXY(vertex, projectX ? positions.getZ(vertex) : positions.getX(vertex), projectY ? positions.getZ(vertex) : positions.getY(vertex));
        }
      }
      mesh.geometry.setAttribute(`uv1`, uv);
    });
    prepared = true;
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    surfaces.forEach(({ kind, material }) => {
      const detail = maps.get(kind);
      if (material.bumpMap === detail?.bump) material.bumpMap = null;
      if (material.roughnessMap === detail?.roughness) material.roughnessMap = null;
    });
    maps.forEach(detail => { detail.bump.dispose(); detail.roughness.dispose(); });
    maps.clear();
    materials.clear();
  };
  return { prepare, dispose };
};
