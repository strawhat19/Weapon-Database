import Head from 'expo-router/head';
import AppShell from '../src/components/AppShell';
import { appIconUrl, appManifestUrl } from '../src/shared/assets';

const Weapons = () => <>
  <Head>
    <title>Weapons | Weapon Database</title>
    <link rel={`manifest`} href={appManifestUrl} />
    <link rel={`icon`} type={`image/svg+xml`} href={appIconUrl()} />
    <link rel={`apple-touch-icon`} sizes={`180x180`} href={appIconUrl(180)} />
  </Head>
  <AppShell page={`weapons`} />
</>;
export default Weapons;
