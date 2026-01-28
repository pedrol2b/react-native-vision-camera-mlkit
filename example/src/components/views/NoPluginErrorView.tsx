import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from '../ui/Text';

const NoPluginErrorView = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.errorContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.errorContent}>
        <Text variant="xl" style={styles.errorTitle}>
          Plugin Configuration Error
        </Text>
        <Text
          variant="md"
          style={[styles.errorMessage, { color: theme.colors.text.secondary }]}
        >
          No plugin ID was provided. This is a navigation error. Please return
          to the home screen and try again.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorContent: {
    maxWidth: 400,
    alignItems: 'center',
  },
  errorTitle: {
    textAlign: 'center',
    marginBottom: 12,
  },
  errorMessage: {
    textAlign: 'center',
  },
});

export { NoPluginErrorView };
