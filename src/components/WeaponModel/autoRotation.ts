import * as THREE from 'three';

type AutoRotationOptions = {
  render: () => void;
  object: THREE.Object3D;
  viewport: HTMLElement;
  reducedMotion: MediaQueryList;
  onChange: (enabled: boolean) => void;
};

export const createAutoRotation = ({ object, render, viewport, onChange, reducedMotion }: AutoRotationOptions) => {
  const pointers = new Set<number>();
  const axis = new THREE.Vector3(0, 1, 0);
  const step = new THREE.Quaternion();
  const angularSpeed = THREE.MathUtils.degToRad(6);
  let enabled = !reducedMotion.matches;
  let visible = typeof IntersectionObserver === `undefined`;
  let observer: IntersectionObserver | undefined;
  let resumeTimer: number | undefined;
  let frame: number | undefined;
  let lastFrame: number | undefined;
  let resumeAt = 0;
  let speed = 0;
  let disposed = false;

  const stop = () => {
    if (frame !== undefined) window.cancelAnimationFrame(frame);
    if (resumeTimer !== undefined) window.clearTimeout(resumeTimer);
    resumeTimer = undefined;
    lastFrame = undefined;
    frame = undefined;
    speed = 0;
    if (viewport.dataset.motion !== `paused`) viewport.dataset.motion = `paused`;
  };
  const canRotate = () => !disposed && enabled && visible && !document.hidden && !pointers.size && viewport.dataset.context !== `lost`;
  const animate = (time: number) => {
    frame = undefined;
    if (!canRotate()) { stop(); return; }
    const elapsed = lastFrame === undefined ? 0 : Math.min((time - lastFrame) / 1000, 0.05);
    lastFrame = time;
    if (elapsed > 0) {
      speed = THREE.MathUtils.damp(speed, angularSpeed, 2.2, elapsed);
      step.setFromAxisAngle(axis, speed * elapsed);
      object.quaternion.premultiply(step).normalize();
      render();
    }
    frame = window.requestAnimationFrame(animate);
  };
  const refresh = () => {
    if (!canRotate()) { stop(); return; }
    if (resumeTimer !== undefined) window.clearTimeout(resumeTimer);
    resumeTimer = undefined;
    const delay = resumeAt - performance.now();
    if (delay > 0) {
      stop();
      resumeTimer = window.setTimeout(refresh, delay);
    } else if (frame === undefined) {
      viewport.dataset.motion = `running`;
      frame = window.requestAnimationFrame(animate);
    }
  };
  const defer = () => {
    resumeAt = performance.now() + 2600;
    refresh();
  };
  const setEnabled = (nextEnabled: boolean) => {
    if (disposed) return;
    enabled = nextEnabled;
    resumeAt = 0;
    stop();
    onChange(enabled);
    refresh();
  };
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === `mouse` && event.button !== 0) return;
    pointers.add(event.pointerId);
    refresh();
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!pointers.delete(event.pointerId)) return;
    if (!pointers.size) defer();
  };
  const onVisibilityChange = () => {
    if (document.hidden) pointers.clear();
    refresh();
  };
  const onMotionChange = () => setEnabled(!reducedMotion.matches);
  const dispose = () => {
    disposed = true;
    stop();
    pointers.clear();
    observer?.disconnect();
    viewport.removeEventListener(`pointerdown`, onPointerDown);
    window.removeEventListener(`pointerup`, onPointerUp);
    window.removeEventListener(`pointercancel`, onPointerUp);
    document.removeEventListener(`visibilitychange`, onVisibilityChange);
    reducedMotion.removeEventListener?.(`change`, onMotionChange);
    delete viewport.dataset.motion;
  };

  viewport.addEventListener(`pointerdown`, onPointerDown);
  window.addEventListener(`pointerup`, onPointerUp);
  window.addEventListener(`pointercancel`, onPointerUp);
  document.addEventListener(`visibilitychange`, onVisibilityChange);
  reducedMotion.addEventListener?.(`change`, onMotionChange);
  if (typeof IntersectionObserver !== `undefined`) {
    observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.05);
      refresh();
    }, { threshold: [0, 0.05] });
    observer.observe(viewport);
  }
  onChange(enabled);
  refresh();
  return { defer, dispose, refresh, setEnabled };
};
