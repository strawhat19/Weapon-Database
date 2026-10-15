import { ScrollView, Text, View } from 'react-native';
import { useTheme } from '../../shared/themeContext';
import { information, type InfoPage } from './content';
const PublicInfo = ({ page }: { page: InfoPage }) => {
 const { palette } = useTheme(); const content = information[page];
 return <ScrollView style={{ backgroundColor: palette.background }}><View style={{ padding: 24, gap: 16 }}><Text accessibilityRole={`header`} style={{ fontSize: 28, color: palette.text }}>{content.title}</Text>{content.paragraphs.map(paragraph => <Text key={paragraph} style={{ color: palette.text }}>{paragraph}</Text>)}</View></ScrollView>;
};
export default PublicInfo;
