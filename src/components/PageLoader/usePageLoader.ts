import { gsap } from 'gsap';
import { usePathname } from 'expo-router';
import { assetUrl } from '../../shared/assets';
import { pageRoutes } from '../../shared/routes';
import { useTheme } from '../../shared/themeContext';
import { useArmory } from '../../shared/armoryContext';
import { useRef, useState, useEffect, useCallback } from 'react';

type AdvanceProgress = (target: number, ready: boolean) => void;
const fontFaces = [`600 1em "Weapon Rajdhani"`, `400 1em "Weapon Barlow"`, `400 1em "Weapon Saira Stencil One"`, `400 1em "Weapon JetBrains Mono"`];

const settleTask = (task: Promise<unknown>, signal: AbortSignal): Promise<boolean> => new Promise(resolve => {
  let settled = false;
  const finish = (success: boolean) => {
    if (settled) return;
    settled = true;
    window.clearTimeout(timer);
    signal.removeEventListener(`abort`, abort);
    resolve(success);
  };
  const abort = () => finish(false);
  const timer = window.setTimeout(abort, 6500);
  signal.addEventListener(`abort`, abort, { once: true });
  task.then(() => finish(true), abort);
  if (signal.aborted) abort();
});

const loadImage = (source: string, signal: AbortSignal): Promise<boolean> => {
  const image = new Image();
  const task = new Promise<void>((resolve, reject) => {
    image.onload = () => { image.decode?.().then(resolve, reject) ?? resolve(); };
    image.onerror = () => reject(new Error(`Preview Image Unavailable`));
    image.src = source;
  });
  return settleTask(task, signal).then(success => {
    image.onload = null;
    image.onerror = null;
    if (!success) image.removeAttribute(`src`);
    return success;
  });
};

export const usePageLoader = () => {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const percent = useRef<HTMLSpanElement>(null);
  const advance = useRef<AdvanceProgress | null>(null);
  const { theme, hydrated } = useTheme();
  const { loading } = useArmory();
  const [visible, setVisible] = useState(true);
  const [fontProgress, setFontProgress] = useState(0);
  const [assetProgress, setAssetProgress] = useState(0);
  const [modelSettled, setModelSettled] = useState(false);
  const [previewOnly, setPreviewOnly] = useState(false);
  const [startupTimedOut, setStartupTimedOut] = useState(false);
  const reportModelSettled = useCallback(() => setModelSettled(true), []);
  const featuredModelReady = modelSettled || pathname !== pageRoutes.home;
  const ready = startupTimedOut || (hydrated && !loading && fontProgress === 1 && assetProgress === 1 && featuredModelReady);
  const target = startupTimedOut ? 100 : Math.round(((hydrated ? 1 : 0) + (loading ? 0 : 1) + fontProgress + assetProgress + (featuredModelReady ? 1 : 0)) * 20);
  const stage = !ready
    ? !hydrated ? `Restoring Your Theme` : loading ? `Opening The Archive` : fontProgress < 1 || assetProgress < 1 ? `Preparing The Vault` : `Rendering The Featured Model`
    : startupTimedOut || previewOnly ? `Opening The Preview` : `Vault Unlocked`;

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setStartupTimedOut(true), 9000);
    return () => window.clearTimeout(timer);
  }, [visible]);

  useEffect(() => {
    if (!visible || !hydrated) return;
    const controller = new AbortController();
    const { signal } = controller;
    const images = [...new Set([`brand/crest.svg`, `brand/wordmark.svg`, `images/armory-rifle.png`, `textures/dark-brushed-steel.png`, `textures/${theme}-brushed-steel.png`])];
    let fontsSettled = 0;
    let imagesSettled = 0;
    const update = (success: boolean, group: `fonts` | `images`) => {
      if (signal.aborted) return;
      if (!success) setPreviewOnly(true);
      if (group === `fonts`) setFontProgress(++fontsSettled / fontFaces.length);
      else setAssetProgress(++imagesSettled / images.length);
    };
    setFontProgress(0);
    setAssetProgress(0);
    images.forEach(source => { void loadImage(assetUrl(source), signal).then(success => update(success, `images`)); });
    fontFaces.forEach(face => {
      const task = document.fonts?.load(face) ?? Promise.resolve();
      void settleTask(task, signal).then(success => update(success, `fonts`));
    });
    return () => controller.abort();
  }, [theme, visible, hydrated]);

  useEffect(() => {
    const shell = root.current;
    const page = content.current;
    const meter = progress.current;
    const digits = percent.current;
    if (!visible || !shell || !page || !meter || !digits) return;
    const previousOverflow = document.body.style.overflow;
    const media = window.matchMedia(`(prefers-reduced-motion: reduce)`);
    const context = gsap.context(() => {}, shell);
    const value = { percent: 0 };
    const cartridges = Array.from(shell.querySelectorAll<HTMLElement>(`.page-loader__cartridge`));
    const fill = shell.querySelector(`.page-loader__progress-fill`);
    const setFill = fill ? gsap.quickSetter(fill, `scaleX`) : undefined;
    let reducedMotion = media.matches;
    let introReady = reducedMotion;
    let resourcesReady = false;
    let opening = false;
    let disposed = false;
    let displayedPercent = -1;
    let counterTween: gsap.core.Tween | undefined;
    let intro: gsap.core.Timeline | undefined;
    let ambient: gsap.core.Timeline | undefined;
    let outro: gsap.core.Timeline | undefined;
    document.body.style.overflow = `hidden`;

    const updateMeter = () => {
      const current = Math.min(100, Math.floor(value.percent));
      setFill?.(value.percent / 100);
      if (current === displayedPercent) return;
      displayedPercent = current;
      digits.textContent = String(current).padStart(2, `0`);
      meter.setAttribute(`aria-valuenow`, String(current));
      cartridges.forEach((cartridge, index) => cartridge.style.setProperty(`--cartridge-fill`, String(Math.max(0, Math.min(1, (current - index * 10) / 10)))));
    };
    const finish = () => { if (!disposed) setVisible(false); };
    const openVault = context.add(`openVault`, () => {
      if (disposed || opening || !introReady || !resourcesReady || value.percent < 99.99) return;
      opening = true;
      ambient?.kill();
      gsap.killTweensOf(digits);
      outro = gsap.timeline({ onComplete: finish });
      if (reducedMotion) {
        gsap.set(page, { y: 0, autoAlpha: 1 });
        outro.to(`.page-loader`, { autoAlpha: 0, duration: .12 });
        return;
      }
      outro
        .to(`.page-loader__bolt`, { rotation: 90, duration: .35, stagger: .035, ease: `power3.inOut` }, 0)
        .to(`.page-loader__dial`, { rotation: `+=70`, duration: .5, ease: `power3.inOut` }, 0)
        .to(`.page-loader__crest-half--left`, { x: -42, rotationY: -35, opacity: 0, filter: `blur(7px)`, duration: .6, ease: `power3.in` }, .12)
        .to(`.page-loader__crest-half--right`, { x: 42, rotationY: 35, opacity: 0, filter: `blur(7px)`, duration: .6, ease: `power3.in` }, .12)
        .to(`.page-loader__content`, { y: -18, autoAlpha: 0, filter: `blur(8px)`, duration: .5, ease: `power2.in` }, .3)
        .to(`.page-loader__door--left`, { xPercent: -102, duration: 1.05, ease: `expo.inOut` }, .28)
        .to(`.page-loader__door--right`, { xPercent: 102, duration: 1.05, ease: `expo.inOut` }, .28)
        .to(page, { y: 0, autoAlpha: 1, duration: .95, ease: `power3.out` }, .54)
        .to(`.page-loader`, { autoAlpha: 0, duration: .16 }, 1.28);
    }) as () => void;
    const animateProgress = context.add(`advance`, (nextTarget: number, nextReady: boolean) => {
      if (disposed || opening) return;
      resourcesReady = nextReady;
      counterTween?.kill();
      const next = Math.max(value.percent, nextTarget);
      const duration = reducedMotion ? 0 : .65;
      counterTween = gsap.to(value, { percent: next, duration, ease: `power2.out`, onUpdate: updateMeter, onComplete: openVault });
      if (!reducedMotion && next - value.percent > 1) {
        gsap.killTweensOf(digits);
        gsap.timeline().to(digits, { skewY: -3, filter: `blur(3px)`, duration: .12 }).to(digits, { skewY: 0, filter: `blur(0px)`, duration: .25 }, .4);
      }
      if (reducedMotion) updateMeter();
    }) as AdvanceProgress;
    context.add(() => {
      gsap.set(page, { y: reducedMotion ? 0 : 16, autoAlpha: 0 });
      if (reducedMotion) {
        gsap.set(`.page-loader__content`, { autoAlpha: 1 });
        return;
      }
      intro = gsap.timeline({ onComplete: () => { introReady = true; openVault(); } });
      intro
        .fromTo(`.page-loader__content`, { y: 20, autoAlpha: 0, filter: `blur(9px)` }, { y: 0, autoAlpha: 1, filter: `blur(0px)`, duration: .7, ease: `power3.out` })
        .fromTo(`.page-loader__cartridge`, { y: 12 }, { y: 0, duration: .4, stagger: .035, ease: `power3.out` }, .3);
      ambient = gsap.timeline({ repeat: -1 });
      ambient
        .to(`.page-loader__dial`, { rotation: `+=24`, duration: 2.1, ease: `sine.inOut` }, 0)
        .fromTo(`.page-loader__crest-scan`, { opacity: 0, clipPath: `inset(0 0 98%)` }, { opacity: .5, clipPath: `inset(98% 0 0)`, duration: 1.65, ease: `none` }, .2)
        .to(`.page-loader__crest-scan`, { opacity: 0, duration: .15 }, 1.85);
    });
    advance.current = animateProgress;
    const onMotionChange = () => {
      reducedMotion = media.matches;
      if (!reducedMotion) return;
      ambient?.kill();
      intro?.progress(1);
      counterTween?.progress(1);
      if (outro) outro.progress(1);
      else openVault();
    };
    media.addEventListener?.(`change`, onMotionChange);
    return () => {
      disposed = true;
      advance.current = null;
      media.removeEventListener?.(`change`, onMotionChange);
      context.revert();
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  useEffect(() => { advance.current?.(target, ready); }, [target, ready]);
  return { root, content, progress, percent, visible, stage, reportModelSettled };
};
