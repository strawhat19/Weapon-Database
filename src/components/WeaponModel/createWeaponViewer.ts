import * as THREE from 'three';
import { createRifleModel } from './buildRifle';
import { createAutoRotation } from './autoRotation';
import type { SkinId, ThemeMode } from '../../types/types';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export type WeaponViewer = {
  dispose: () => void;
  resetView: () => void;
  setSkin: (skin: SkinId) => void;
  setTheme: (theme: ThemeMode) => void;
  setAutoRotation: (enabled: boolean) => void;
};

export const createWeaponViewer = (viewport: HTMLDivElement, skin: SkinId, theme: ThemeMode, onAvailability: (available: boolean) => void, onAutoRotation: (enabled: boolean) => void): WeaponViewer => {
  const scene = new THREE.Scene();
  const pivot = new THREE.Group();
  const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`);
  let model: ReturnType<typeof createRifleModel> | undefined;
  let environment: THREE.WebGLRenderTarget | undefined;
  let environmentScene: RoomEnvironment | undefined;
  let environmentGenerator: THREE.PMREMGenerator | undefined;
  let renderer: THREE.WebGLRenderer | undefined;
  let controls: ArcballControls | undefined;
  let observer: ResizeObserver | undefined;
  let autoRotation: ReturnType<typeof createAutoRotation> | undefined;
  let resetView = () => {};
  let render = () => {};
  let resize = () => {};
  let keyDown = (_event: KeyboardEvent) => {};
  let restoreEnvironment = () => {};
  let availabilityFrame: number | undefined;
  let gizmoGeometries = new Set<THREE.BufferGeometry>();
  let resizing = false;
  let disposed = false;

  const cancelAvailability = () => {
    if (availabilityFrame !== undefined) window.cancelAnimationFrame(availabilityFrame);
    availabilityFrame = undefined;
  };
  const revealWhenReady = () => {
    cancelAvailability();
    availabilityFrame = window.requestAnimationFrame(() => {
      availabilityFrame = undefined;
      if (disposed || viewport.dataset.context === `lost`) return;
      try {
        render();
        availabilityFrame = window.requestAnimationFrame(() => {
          availabilityFrame = undefined;
          if (!disposed && viewport.dataset.context !== `lost`) onAvailability(true);
        });
      } catch {
        onAvailability(false);
      }
    });
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    cancelAvailability();
    viewport.dataset.context = `lost`;
    delete viewport.dataset.dragging;
    if (controls) controls.enabled = false;
    autoRotation?.refresh();
    onAvailability(false);
  };
  const onContextRestored = () => {
    if (disposed) return;
    try {
      restoreEnvironment();
      delete viewport.dataset.context;
      if (controls) controls.enabled = true;
      resize();
      autoRotation?.refresh();
      revealWhenReady();
    } catch {
      onAvailability(false);
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === `mouse` && event.button !== 0) return;
    viewport.focus({ preventScroll: true });
  };
  const onInteractionStart = () => { viewport.dataset.dragging = `true`; };
  const onInteractionEnd = () => { delete viewport.dataset.dragging; };
  const onMotionChange = () => { if (controls) controls.enableAnimations = !reducedMotion.matches; };
  const onControlsChange = () => {
    if (resizing) return;
    autoRotation?.defer();
    render();
  };
  const retireGizmoGeometries = () => {
    const current = new Set<THREE.BufferGeometry>();
    scene.children.filter(child => child !== pivot).forEach(child => child.traverse(object => {
      const line = object as THREE.Line;
      if (line.isLine) current.add(line.geometry);
    }));
    gizmoGeometries.forEach(geometry => { if (!current.has(geometry)) geometry.dispose(); });
    gizmoGeometries = current;
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAvailability();
    autoRotation?.dispose();
    observer?.disconnect();
    window.removeEventListener(`resize`, resize);
    viewport.removeEventListener(`keydown`, keyDown);
    viewport.removeEventListener(`pointerdown`, onPointerDown);
    viewport.removeEventListener(`pointercancel`, onInteractionEnd);
    reducedMotion.removeEventListener?.(`change`, onMotionChange);
    renderer?.domElement.removeEventListener(`webglcontextlost`, onContextLost);
    renderer?.domElement.removeEventListener(`webglcontextrestored`, onContextRestored);
    controls?.removeEventListener(`change`, onControlsChange);
    controls?.removeEventListener(`start`, onInteractionStart);
    controls?.removeEventListener(`end`, onInteractionEnd);
    scene.remove(pivot);
    model?.dispose();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>();
    scene.traverse(object => {
      const drawable = object as THREE.Mesh;
      if (drawable.geometry) geometries.add(drawable.geometry);
      if (drawable.material) {
        const entries = Array.isArray(drawable.material) ? drawable.material : [drawable.material];
        entries.forEach(material => materials.add(material));
      }
    });
    geometries.forEach(geometry => geometry.dispose());
    gizmoGeometries.forEach(geometry => { if (!geometries.has(geometry)) geometry.dispose(); });
    materials.forEach(material => material.dispose());
    controls?.dispose();
    environmentScene?.dispose();
    environmentGenerator?.dispose();
    environment?.dispose();
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
    delete viewport.dataset.context;
    delete viewport.dataset.dragging;
  };

  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: `low-power` });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.domElement.id = `hero-weapon-model-canvas`;
    renderer.domElement.className = `weapon-model__canvas`;
    renderer.domElement.setAttribute(`aria-hidden`, `true`);
    renderer.domElement.addEventListener(`webglcontextlost`, onContextLost);
    renderer.domElement.addEventListener(`webglcontextrestored`, onContextRestored);
    viewport.appendChild(renderer.domElement);

    restoreEnvironment = () => {
      if (!renderer || disposed) return;
      environmentScene?.dispose();
      environmentGenerator?.dispose();
      environmentScene = new RoomEnvironment();
      environmentGenerator = new THREE.PMREMGenerator(renderer);
      const nextEnvironment = environmentGenerator.fromScene(environmentScene, 0.04);
      environment?.dispose();
      environment = nextEnvironment;
      scene.environment = environment.texture;
      environmentScene.dispose();
      environmentGenerator.dispose();
      environmentScene = undefined;
      environmentGenerator = undefined;
    };
    restoreEnvironment();

    const keyLight = new THREE.DirectionalLight(0xf5f4ea, 3.2);
    const fillLight = new THREE.DirectionalLight(0xb8cbd2, 2);
    const rimLight = new THREE.DirectionalLight(0xe0ead6, 2.8);
    keyLight.position.set(-4, 7, 8);
    fillLight.position.set(5, 2, 4);
    rimLight.position.set(0, 5, -6);
    scene.add(keyLight, fillLight, rimLight, new THREE.HemisphereLight(0xcbd5de, 0x263027, 1));

    model = createRifleModel(skin);
    const bounds = new THREE.Box3().setFromObject(model.object);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const span = Math.max(size.x, size.y, size.z) * 1.15;
    model.object.position.sub(center);
    pivot.add(model.object);
    pivot.rotation.z = THREE.MathUtils.degToRad(8);
    const initialRotation = pivot.quaternion.clone();
    scene.add(pivot);

    const initialWidth = Math.max(1, viewport.clientWidth);
    const initialHeight = Math.max(1, viewport.clientHeight);
    const verticalSpan = span * initialHeight / initialWidth;
    const camera = new THREE.OrthographicCamera(-span / 2, span / 2, verticalSpan / 2, -verticalSpan / 2, 0.1, span * 10);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(initialWidth, initialHeight, false);
    camera.position.set(span * 0.16, span * 0.12, span * 2);
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld(true);
    const corners = model.framingPoints.map(point => point.clone().sub(center));
    const projected = new THREE.Vector3();

    render = () => {
      if (disposed || !renderer || viewport.dataset.context === `lost`) return;
      retireGizmoGeometries();
      camera.updateMatrixWorld(true);
      pivot.scale.setScalar(1);
      pivot.updateMatrixWorld(true);
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      corners.forEach(corner => {
        projected.copy(corner).applyMatrix4(pivot.matrixWorld).applyMatrix4(camera.matrixWorldInverse);
        minX = Math.min(minX, projected.x);
        minY = Math.min(minY, projected.y);
        maxX = Math.max(maxX, projected.x);
        maxY = Math.max(maxY, projected.y);
      });
      const projectedWidth = Math.max(Math.abs(minX), Math.abs(maxX)) * 2;
      const projectedHeight = Math.max(Math.abs(minY), Math.abs(maxY)) * 2;
      const scale = Math.min(1, (camera.right - camera.left) * 0.94 / projectedWidth, (camera.top - camera.bottom) * 0.88 / projectedHeight);
      pivot.scale.setScalar(scale);
      renderer.render(scene, camera);
    };

    controls = new ArcballControls(camera, renderer.domElement, scene);
    retireGizmoGeometries();
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableFocus = false;
    controls.enableGrid = false;
    controls.rotateSpeed = 0.85;
    controls.enableAnimations = !reducedMotion.matches;
    controls.setGizmosVisible(false);
    controls.unsetMouseAction(2);
    controls.unsetMouseAction(1);
    controls.unsetMouseAction(`WHEEL`);
    controls.unsetMouseAction(0, `CTRL`);
    controls.unsetMouseAction(1, `SHIFT`);
    controls.unsetMouseAction(`WHEEL`, `SHIFT`);
    controls.saveState();
    controls.addEventListener(`change`, onControlsChange);
    controls.addEventListener(`start`, onInteractionStart);
    controls.addEventListener(`end`, onInteractionEnd);

    resetView = () => {
      if (disposed) return;
      autoRotation?.defer();
      pivot.quaternion.copy(initialRotation);
      controls?.reset();
      controls?.setGizmosVisible(false);
      render();
    };
    keyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.target !== viewport) return;
      if (event.key === `Home` || event.key.toLowerCase() === `r`) {
        event.preventDefault();
        resetView();
        return;
      }
      const rotations: Record<string, [number, number, number, number]> = {
        q: [0, 0, 1, 1],
        e: [0, 0, 1, -1],
        ArrowUp: [1, 0, 0, -1],
        ArrowDown: [1, 0, 0, 1],
        ArrowLeft: [0, 1, 0, -1],
        ArrowRight: [0, 1, 0, 1],
      };
      const rotation = rotations[event.key.length === 1 ? event.key.toLowerCase() : event.key];
      if (!rotation) return;
      event.preventDefault();
      autoRotation?.defer();
      const [x, y, z, direction] = rotation;
      const axis = new THREE.Vector3(x, y, z).applyQuaternion(camera.quaternion);
      const angle = THREE.MathUtils.degToRad(event.shiftKey ? 15 : 5) * direction;
      pivot.quaternion.premultiply(new THREE.Quaternion().setFromAxisAngle(axis, angle));
      render();
    };

    resize = () => {
      if (disposed || !renderer) return;
      const width = Math.max(1, viewport.clientWidth);
      const height = Math.max(1, viewport.clientHeight);
      camera.top = span * height / width / 2;
      camera.bottom = -camera.top;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      resizing = true;
      try { controls?.setTbRadius(controls.radiusFactor); }
      finally { resizing = false; }
      render();
    };
    viewport.addEventListener(`keydown`, keyDown);
    viewport.addEventListener(`pointerdown`, onPointerDown);
    viewport.addEventListener(`pointercancel`, onInteractionEnd);
    window.addEventListener(`resize`, resize);
    reducedMotion.addEventListener?.(`change`, onMotionChange);
    if (typeof ResizeObserver !== `undefined`) {
      observer = new ResizeObserver(resize);
      observer.observe(viewport);
    }

    const setSkin = (nextSkin: SkinId) => { model?.setSkin(nextSkin); render(); };
    const setTheme = (nextTheme: ThemeMode) => {
      if (!renderer || disposed) return;
      renderer.toneMappingExposure = nextTheme === `dark` ? 1.2 : 1.05;
      scene.environmentIntensity = nextTheme === `dark` ? 1 : 0.85;
      render();
    };
    resize();
    setTheme(theme);
    autoRotation = createAutoRotation({ object: pivot, render, viewport, onChange: onAutoRotation, reducedMotion });
    revealWhenReady();
    const setAutoRotation = (enabled: boolean) => autoRotation?.setEnabled(enabled);
    return { dispose, setSkin, setTheme, resetView, setAutoRotation };
  } catch (error) {
    dispose();
    throw error;
  }
};
