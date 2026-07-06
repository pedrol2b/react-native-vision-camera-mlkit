import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type ComponentProps,
} from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Camera,
  CommonResolutions,
  useAsyncRunner,
  useFrameOutput,
  type CameraRef,
} from 'react-native-vision-camera';
import {
  useBarcodeScanning,
  useTextRecognition,
  type Orientation,
} from 'react-native-vision-camera-mlkit';
import { scheduleOnRN } from 'react-native-worklets';
import { PLUGIN_ID } from '../../constants/PLUGINS';
import { useTheme } from '../../providers/ThemeProvider';
import {
  usePluginOptionsStore,
  useSettingsStore,
  useTerminalStore,
} from '../../stores';

const normalizeResultObject = (data: unknown) => {
  if (data === null || data === undefined) return data;

  if (typeof data !== 'object') return data;

  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return String(data);
  }
};

type CameraViewProps = ComponentProps<typeof Camera> & {
  pluginId: PLUGIN_ID;
  flipCamera: () => void;
  isFrameProcessorEnabled?: boolean;
  frameOutputOrientation: SharedValue<Orientation>;
};

const CameraView = forwardRef<CameraRef, CameraViewProps>(
  (
    {
      device,
      isActive,
      pluginId,
      flipCamera,
      isFrameProcessorEnabled = true,
      frameOutputOrientation,
      torchMode,
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const {
      frameProcessorFps,
      pixelFormat,
      enableZoomGesture,
      enableTapGesture,
      enableDoubleTapGesture,
    } = useSettingsStore();
    const { sharedOptions, pluginOptions } = usePluginOptionsStore();

    const textRecognitionPlugin = useTextRecognition({
      language: pluginOptions[PLUGIN_ID.TEXT_RECOGNITION].language,
      ...sharedOptions,
    });

    const barcodeScanningPlugin = useBarcodeScanning({
      formats: pluginOptions[PLUGIN_ID.BARCODE_SCANNING].formats,
      enableAllPotentialBarcodes:
        pluginOptions[PLUGIN_ID.BARCODE_SCANNING].enableAllPotentialBarcodes,
      ...sharedOptions,
    });

    const [focusPoint, setFocusPoint] = useState<{ x: number; y: number }>();

    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);
    const frameCount = useSharedValue(0);
    const asyncRunner = useAsyncRunner();

    const frameInterval = useMemo(
      () => Math.max(1, Math.round(30 / frameProcessorFps)),
      [frameProcessorFps]
    );

    const focus = useCallback(
      (point: { x: number; y: number }) => {
        if (typeof ref === 'function' || !ref?.current) return;

        ref.current.focusTo(point).catch(console.error);
        setFocusPoint(point);

        scale.value = 0;
        opacity.value = 1;

        scale.value = withSequence(
          withTiming(1.2, { duration: 150 }),
          withTiming(1, { duration: 100 })
        );

        opacity.value = withSequence(
          withTiming(1, { duration: 150 }),
          withTiming(0, { duration: 600 })
        );
      },
      [ref, scale, opacity]
    );

    const tapGesture = Gesture.Tap().onEnd(({ x, y }) => {
      scheduleOnRN(focus, { x, y });
    });

    const doubleTapGesture = Gesture.Tap()
      .numberOfTaps(2)
      .onEnd(() => {
        scheduleOnRN(flipCamera);
      });

    const gestures = [];
    if (enableDoubleTapGesture) gestures.push(doubleTapGesture);
    if (enableTapGesture) gestures.push(tapGesture);

    const gesture =
      gestures.length > 0 ? Gesture.Exclusive(...gestures) : Gesture.Tap();

    const focusOverlayStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    }));

    const addResult = useCallback((data: unknown) => {
      console.log(data);
      useTerminalStore
        .getState()
        .addEntry(normalizeResultObject(data), 'camera');
    }, []);

    const frameOutput = useFrameOutput({
      targetResolution: CommonResolutions.VGA_16_9,
      pixelFormat,
      onFrame(frame) {
        'worklet';

        if (!isFrameProcessorEnabled) {
          frame.dispose();
          return;
        }

        frameCount.value = (frameCount.value + 1) % frameInterval;
        if (frameCount.value !== 0) {
          frame.dispose();
          return;
        }

        const accepted = asyncRunner.runAsync(() => {
          'worklet';

          try {
            let resultObject: any = null;
            const withArguments = {
              outputOrientation: frameOutputOrientation.value,
            };

            if (pluginId === PLUGIN_ID.TEXT_RECOGNITION) {
              resultObject = textRecognitionPlugin.textRecognition(
                frame,
                withArguments
              );
            } else if (pluginId === PLUGIN_ID.BARCODE_SCANNING) {
              resultObject = barcodeScanningPlugin.barcodeScanning(
                frame,
                withArguments
              );
            }

            if (resultObject) {
              scheduleOnRN(addResult, resultObject);
            }
          } finally {
            frame.dispose();
          }
        });

        if (!accepted) {
          frame.dispose();
        }
      },
    });

    return (
      <GestureDetector gesture={gesture}>
        <Reanimated.View
          style={styles.container}
          accessibilityLabel="Camera viewfinder"
          accessibilityHint="Tap to focus, double tap to flip camera"
        >
          <Camera
            {...props}
            ref={ref}
            device={device}
            isActive={isActive}
            outputs={[frameOutput]}
            constraints={[{ resolutionBias: frameOutput }]}
            torchMode={torchMode}
            enableNativeZoomGesture={enableZoomGesture}
            enableNativeTapToFocusGesture={enableTapGesture}
            resizeMode="cover"
            style={styles.container}
          />
          {focusPoint && (
            <Reanimated.View
              style={[
                styles.focusOverlay,
                {
                  left: focusPoint.x - 35,
                  top: focusPoint.y - 35,
                  borderColor: theme.colors.focus.border,
                  shadowColor: theme.colors.shadow,
                },
                focusOverlayStyle,
              ]}
            />
          )}
        </Reanimated.View>
      </GestureDetector>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  focusOverlay: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 4,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
});

export { CameraView };
