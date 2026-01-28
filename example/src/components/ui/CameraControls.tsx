import { BlurView } from '@react-native-community/blur';
import {
  Gauge,
  Settings,
  SwitchCamera,
  Terminal,
  Zap,
  ZapOff,
} from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import type { Orientation } from 'react-native-vision-camera';

/** Defaults to dark theme for the CameraView */
import { darkTheme as theme } from '../../styles/themes';
import { CameraButton } from './CameraButton';

type TorchState = 'off' | 'on';

type CameraControlsProps = {
  onFlipCamera: () => void;
  torch: TorchState;
  onToggleTorch: () => void;
  onToggleFpsGraph: () => void;
  onOpenSettings: () => void;
  onOpenTerminal: () => void;
  outputOrientation: SharedValue<Orientation>;
};

const CameraControls = ({
  onFlipCamera,
  torch,
  onToggleTorch,
  onToggleFpsGraph,
  onOpenSettings,
  onOpenTerminal,
  outputOrientation,
}: CameraControlsProps) => {
  const Torch = torch === 'on' ? Zap : ZapOff;

  return (
    <View style={styles.container}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={10}
        reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.5)"
      />
      <CameraButton
        onPress={onFlipCamera}
        accessibilityLabel="Flip camera"
        accessibilityHint="Switches between front and back camera"
        outputOrientation={outputOrientation}
      >
        <SwitchCamera size={24} color={theme.colors.icon.primary} />
      </CameraButton>
      <CameraButton
        onPress={onToggleTorch}
        accessibilityLabel="Toggle torch"
        accessibilityHint="Turns the camera torch on or off"
        outputOrientation={outputOrientation}
      >
        <Torch size={24} color={theme.colors.icon.primary} />
      </CameraButton>
      <CameraButton
        onPress={onToggleFpsGraph}
        accessibilityLabel="Toggle FPS graph"
        accessibilityHint="Shows or hides the FPS graph overlay"
        outputOrientation={outputOrientation}
      >
        <Gauge size={24} color={theme.colors.icon.primary} />
      </CameraButton>
      <CameraButton
        onPress={onOpenTerminal}
        accessibilityLabel="Open terminal"
        accessibilityHint="Shows the terminal with ML Kit results"
        outputOrientation={outputOrientation}
      >
        <Terminal size={24} color={theme.colors.icon.primary} />
      </CameraButton>
      <CameraButton
        onPress={onOpenSettings}
        accessibilityLabel="Open settings"
        accessibilityHint="Opens the settings screen"
        outputOrientation={outputOrientation}
      >
        <Settings size={24} color={theme.colors.icon.primary} />
      </CameraButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 119,
    right: 16,
    borderRadius: 32,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});

export { CameraControls };
