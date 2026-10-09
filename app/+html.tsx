import { assetUrl, appIconUrl, appManifestUrl } from '../src/shared/assets';
import type { PropsWithChildren, CSSProperties } from 'react';
import { defaultTheme, themePalettes, themeCssVariables } from '../src/styles/theme/theme';

const Html = ({ children }: PropsWithChildren) => <html lang={`en`} data-theme={defaultTheme} style={{ ...themeCssVariables(themePalettes[defaultTheme]), colorScheme: defaultTheme } as CSSProperties}>
  <head>
    <meta charSet={`utf-8`} />
    <title>Weapon Database</title>
    <meta name={`theme-color`} content={themePalettes[defaultTheme].background} />
    <meta name={`viewport`} content={`width=device-width, initial-scale=1, viewport-fit=cover`} />
    <meta name={`description`} content={`Explore the weapon archive. Discover firearms, swords, drones, history, and future systems. Save your collection and create personal visual loadouts.`} />
    <link rel={`manifest`} href={appManifestUrl} />
    <link rel={`stylesheet`} href={assetUrl(`fonts/fonts.css`)} />
    <link rel={`icon`} type={`image/svg+xml`} href={appIconUrl()} />
    <link rel={`apple-touch-icon`} sizes={`180x180`} href={appIconUrl(180)} />
    <link rel={`preload`} as={`font`} type={`font/ttf`} crossOrigin={`anonymous`} href={assetUrl(`fonts/SairaStencilOne-Regular.ttf`)} />
    <link rel={`preload`} as={`font`} type={`font/ttf`} crossOrigin={`anonymous`} href={assetUrl(`fonts/Rajdhani-SemiBold.ttf`)} />
  </head>
  <body>{children}</body>
</html>;

export default Html;
