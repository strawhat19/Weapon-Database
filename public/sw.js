const cacheName = `weapon-database-shell-v9`;
const rootUrl = new URL(`./`, self.location.href);
const localFiles = [
  `manifest.webmanifest`,
  `manifest-steel.webmanifest`,
  `manifest-steel-crest.webmanifest`,
  `media/brand/crest.svg`,
  `media/brand/wordmark.svg`,
  `media/brand/app-icons/v1/01-crest-transparent.svg`,
  `media/brand/app-icons/v1/02-crest-steel-silver.svg`,
  `media/brand/app-icons/v1/01-crest-transparent-180.png`,
  `media/brand/app-icons/v1/01-crest-transparent-192.png`,
  `media/brand/app-icons/v1/01-crest-transparent-512.png`,
  `media/brand/app-icons/v1/02-crest-steel-silver-180.png`,
  `media/brand/app-icons/v1/02-crest-steel-silver-192.png`,
  `media/brand/app-icons/v1/02-crest-steel-silver-512.png`,
  `media/brand/app-icons/v2/01-crest-steel-shield.svg`,
  `media/brand/app-icons/v2/01-crest-steel-shield-180.png`,
  `media/brand/app-icons/v2/01-crest-steel-shield-192.png`,
  `media/brand/app-icons/v2/01-crest-steel-shield-512.png`,
  `media/fonts/fonts.css`,
  `media/fonts/Barlow-Regular.ttf`,
  `media/fonts/Barlow-Medium.ttf`,
  `media/fonts/Barlow-SemiBold.ttf`,
  `media/fonts/Rajdhani-Regular.ttf`,
  `media/fonts/Rajdhani-SemiBold.ttf`,
  `media/fonts/Rajdhani-Bold.ttf`,
  `media/fonts/JetBrainsMono-Regular.ttf`,
  `media/fonts/SairaStencilOne-Regular.ttf`,
  `media/images/armory-rifle.png`,
  `media/images/vx-9.svg`,
  `media/images/bastion-12.svg`,
  `media/images/sentinel-sr8.svg`,
  `media/images/kestrel-p9.svg`,
  `media/images/aurelius-longsword.svg`,
  `media/images/ronin-katana.svg`,
  `media/images/crescent-saber.svg`,
  `media/images/kestrel-quad.svg`,
  `media/images/peregrine-wing.svg`,
  `media/images/ranger-recurve.svg`,
  `media/images/vanguard-compound.svg`,
  `media/images/future-drone.png`,
  `media/images/heritage-blade.png`,
  `media/textures/dark-brushed-steel.png`,
  `media/textures/light-brushed-steel.png`,
];

self.addEventListener(`install`, event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    const shell = await fetch(rootUrl, { cache: `reload` });
    if (!shell.ok) throw new Error(`The Armory Could Not Be Cached`);
    const html = await shell.clone().text();
    const bundleUrls = [...html.matchAll(/<(?:script|link)\b[^>]*?\b(?:src|href)=["']([^"']+)["']/gi)]
      .map(match => new URL(match[1], rootUrl))
      .filter(url => url.origin === rootUrl.origin && /\.(?:js|css)$/.test(url.pathname));
    await cache.put(rootUrl, shell);
    await cache.addAll([...new Set([...localFiles.map(file => new URL(file, rootUrl).href), ...bundleUrls.map(url => url.href)])]);
    await self.skipWaiting();
  })());
});

self.addEventListener(`activate`, event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(`weapon-database-shell-`) && key !== cacheName).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener(`fetch`, event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== `GET` || url.origin !== rootUrl.origin || !url.pathname.startsWith(rootUrl.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch (failure) {
      const stored = await cache.match(request);
      if (stored) return stored;
      if (request.mode === `navigate`) {
        const shell = await cache.match(rootUrl);
        if (shell) return shell;
      }
      return new Response(`Connect once to open the armory.`, { status: 503, headers: { 'Content-Type': `text/plain; charset=utf-8` } });
    }
  })());
});
