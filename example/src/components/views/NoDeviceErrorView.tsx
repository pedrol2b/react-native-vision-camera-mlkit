import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from '../ui/Text';

const NoDeviceErrorView = () => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.errorContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.errorContent}>
        <Text variant="xl" style={[styles.errorTitle]}>
          No Camera Device Found
        </Text>
        <Text
          variant="md"
          style={[styles.errorMessage, { color: theme.colors.text.secondary }]}
        >
          No camera device is available on this device. The camera feature
          cannot be used at this time.
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

export { NoDeviceErrorView };
