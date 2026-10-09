import '../src/styles/global.scss';
import '../src/components/Brand/styles.scss';
import '../src/components/Modal/styles.scss';
import '../src/components/Hero/styles.scss';
import '../src/components/Header/styles.scss';
import '../src/components/Footer/styles.scss';
import '../src/components/Journal/styles.scss';
import '../src/components/Catalog/styles.scss';
import '../src/components/AppShell/styles.scss';
import '../src/components/LoadoutLab/styles.scss';
import '../src/components/WeaponModel/styles.scss';
import '../src/components/WeaponCard/styles.scss';
import '../src/components/CategoryIndex/styles.scss';
import '../src/components/ArchiveTimeline/styles.scss';
import { Slot } from 'expo-router';
import { ThemeProvider } from '../src/shared/themeContext';
import { ArmoryProvider } from '../src/shared/armoryContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const initialMetrics = { frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, right: 0, bottom: 0, left: 0 } };
const RootLayout = () => <SafeAreaProvider initialMetrics={initialMetrics}><ThemeProvider><ArmoryProvider><Slot /></ArmoryProvider></ThemeProvider></SafeAreaProvider>;

export default RootLayout;
