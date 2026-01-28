import { Linking, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useCameraPermission } from 'react-native-vision-camera';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from '../ui/Text';

const NoCameraPermissionErrorView = () => {
  const { theme } = useTheme();

  const { requestPermission: requestCameraPermission } = useCameraPermission();

  const openSettings = () => Linking.openSettings();

  return (
    <View
      style={[
        styles.errorContainer,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.errorContent}>
        <Text variant="xl" style={styles.errorTitle}>
          Camera Permission Required
        </Text>
        <Text
          variant="md"
          style={[styles.errorMessage, { color: theme.colors.text.secondary }]}
        >
          Camera access is necessary to use this feature. Please grant camera
          permission to continue.
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            styles.primaryButton,
            {
              shadowColor: theme.colors.shadow,
              backgroundColor: theme.colors.text.primary,
            },
          ]}
          onPress={requestCameraPermission}
        >
          <Text
            variant="md"
            style={[styles.buttonText, { color: theme.colors.background }]}
          >
            Request Permission
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            { borderColor: theme.colors.border },
          ]}
          onPress={openSettings}
        >
          <Text variant="md" style={styles.buttonText}>
            Open Settings
          </Text>
        </TouchableOpacity>
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
    marginBottom: 32,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: '600',
  },
});

export { NoCameraPermissionErrorView };
