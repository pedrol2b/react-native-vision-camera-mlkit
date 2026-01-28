import type { ReactNode } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  type SharedValue,
} from 'react-native-reanimated';
import type { Orientation } from 'react-native-vision-camera';

const ROTATION_MAP = {
  'portrait': '0deg',
  'landscape-left': '90deg',
  'landscape-right': '-90deg',
  'portrait-upside-down': '180deg',
} as const;

type CameraButtonProps = {
  onPress: () => void;
  children: ReactNode;
  accessibilityLabel: string;
  accessibilityHint?: string;
  outputOrientation: SharedValue<Orientation>;
};

const CameraButton = ({
  onPress,
  children,
  accessibilityLabel,
  accessibilityHint,
  outputOrientation,
}: CameraButtonProps) => {
  const scale = useSharedValue(1);

  const rotation = useDerivedValue(() => ROTATION_MAP[outputOrientation.value]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: rotation.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.85, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
    >
      <Reanimated.View style={animatedStyle}>{children}</Reanimated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export { CameraButton };
