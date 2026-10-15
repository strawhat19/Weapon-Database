import { Link } from 'expo-router';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from '../../shared/themeContext';
import { workspacePages, type WorkspacePage } from '../../shared/disconnected/routes';
const AccountWorkspace = ({ page }: { page: WorkspacePage }) => {
  const { palette } = useTheme();
  return <ScrollView style={{ flex: 1, backgroundColor: palette.background }}><View style={{ padding: 24, gap: 16 }}><Text accessibilityRole={`header`} style={{ color: palette.text, fontSize: 30 }}>{workspacePages[page]}</Text><Text style={{ color: palette.text }}>The account and library workspace is prepared for web. Native page parity and store validation remain future work. Authentication and cloud data are not connected.</Text><Link href={`/`}>Return to catalog</Link></View></ScrollView>;
};
export default AccountWorkspace;
