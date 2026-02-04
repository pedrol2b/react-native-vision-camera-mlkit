import { Camera, Image } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

type SectionImageInputProps = {
  onTakePhoto: () => void;
  onPickImage: () => void;
  disabled?: boolean;
  disableCamera?: boolean;
  disableLibrary?: boolean;
};

const SectionImageInput = ({
  onTakePhoto,
  onPickImage,
  disabled = false,
  disableCamera = false,
  disableLibrary = false,
}: SectionImageInputProps) => {
  const { theme } = useTheme();

  const isCameraDisabled = disabled || disableCamera;
  const isLibraryDisabled = disabled || disableLibrary;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
          disabled && styles.disabled,
        ]}
      >
        {/* Take Photo */}
        <Pressable
          onPress={onTakePhoto}
          disabled={isCameraDisabled}
          style={({ pressed }) => [
            styles.option,
            pressed && !isCameraDisabled && styles.pressed,
          ]}
        >
          {({ pressed }) => {
            const isActive = pressed && !isCameraDisabled;

            const color = isActive
              ? theme.colors.primary
              : theme.colors.text.secondary;

            return (
              <>
                <Camera
                  size={20}
                  color={color}
                  strokeWidth={2}
                  style={styles.icon}
                />

                <Text variant="sm" style={[styles.label, { color }]}>
                  Take Photo
                </Text>
              </>
            );
          }}
        </Pressable>

        {/* Divider */}
        <View
          style={[styles.divider, { backgroundColor: theme.colors.border }]}
        />

        {/* Choose from Library */}
        <Pressable
          onPress={onPickImage}
          disabled={isLibraryDisabled}
          style={({ pressed }) => [
            styles.option,
            pressed && !isLibraryDisabled && styles.pressed,
          ]}
        >
          {({ pressed }) => {
            const isActive = pressed && !isLibraryDisabled;

            const color = isActive
              ? theme.colors.primary
              : theme.colors.text.secondary;

            return (
              <>
                <Image
                  size={20}
                  color={color}
                  strokeWidth={2}
                  style={styles.icon}
                />

                <Text variant="sm" style={[styles.label, { color }]}>
                  Choose from Library
                </Text>
              </>
            );
          }}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    borderStyle: 'dashed',
    minHeight: 96,
    overflow: 'hidden',
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  pressed: {
    opacity: 0.85,
  },
  icon: {
    marginBottom: 8,
  },
  label: {
    textAlign: 'center',
  },
  divider: {
    width: 1,
    opacity: 0.6,
    marginVertical: 12,
  },
  disabled: {
    opacity: 0.6,
  },
});

export { SectionImageInput };
