import { Github } from 'lucide-react-native';
import { useCallback } from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

const GITHUB_URL =
  'https://github.com/pedrol2b/react-native-vision-camera-mlkit';

const GithubFab = () => {
  const { theme } = useTheme();

  const handlePress = useCallback(() => Linking.openURL(GITHUB_URL), []);

  return (
    <Pressable
      style={[
        styles.fab,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
      onPress={handlePress}
      accessibilityLabel="Open GitHub repository"
      accessibilityRole="button"
    >
      <Github size={24} color={theme.colors.icon.primary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 56,
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
});

export { GithubFab };
