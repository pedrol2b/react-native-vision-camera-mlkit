import { forwardRef, useCallback, useState, type ComponentProps } from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import {
  Camera,
  runAsync,
  runAtTargetFps,
  Templates,
  useCameraFormat,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {
  useTextRecognition,
  type Orientation,
} from 'react-native-vision-camera-mlkit';
import { scheduleOnRN } from 'react-native-worklets';
import {
  useRunOnJS,
  type ISharedValue as SharedWorkletsValue,
} from 'react-native-worklets-core';
import { PLUGIN_ID } from '../../constants/PLUGINS';
import { useTheme } from '../../providers/ThemeProvider';
import {
  usePluginOptionsStore,
  useSettingsStore,
  useTerminalStore,
} from '../../stores';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);

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
  frameOutputOrientation: SharedWorkletsValue<Orientation>;
  onOutputOrientationChangedCallback: (o: Orientation) => void;
};

const CameraView = forwardRef<Camera, CameraViewProps>(
  (
    {
      device,
      isActive,
      pluginId,
      flipCamera,
      isFrameProcessorEnabled = true,
      frameOutputOrientation,
      onOutputOrientationChangedCallback,
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

    // Initialize plugins with options from store
    const textRecognitionPlugin = useTextRecognition({
      language: pluginOptions[PLUGIN_ID.TEXT_RECOGNITION].language,
      ...sharedOptions,
    });

    const [focusPoint, setFocusPoint] = useState<{ x: number; y: number }>();

    const scale = useSharedValue(0);
    const opacity = useSharedValue(0);

    const format = useCameraFormat(device, Templates.FrameProcessing);

    const focus = useCallback(
      (point: { x: number; y: number }) => {
        if (typeof ref === 'function' || !ref?.current) return;

        ref.current.focus(point);
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

    const handleResultWorklet = useRunOnJS((data: unknown) => {
      console.log(data);
      useTerminalStore
        .getState()
        .addEntry(normalizeResultObject(data), 'camera');
    }, []);

    const frameProcessor = useFrameProcessor(
      (frame) => {
        'worklet';

        runAtTargetFps(frameProcessorFps, () => {
          'worklet';

          runAsync(frame, () => {
            'worklet';

            let resultObject: any = null;

            if (pluginId === PLUGIN_ID.TEXT_RECOGNITION) {
              const withArguments = {
                outputOrientation: frameOutputOrientation.value,
              };

              resultObject = textRecognitionPlugin.textRecognition(
                frame,
                withArguments
              );
            }

            if (resultObject) {
              handleResultWorklet(resultObject);
            }
          });
        });
      },
      [
        frameProcessorFps,
        pluginId,
        frameOutputOrientation,
        textRecognitionPlugin,
        handleResultWorklet,
      ]
    );

    return (
      <GestureDetector gesture={gesture}>
        <Reanimated.View
          style={styles.container}
          accessibilityLabel="Camera viewfinder"
          accessibilityHint="Tap to focus, double tap to flip camera"
        >
          <ReanimatedCamera
            ref={ref}
            device={device}
            isActive={isActive}
            format={format}
            pixelFormat={pixelFormat}
            frameProcessor={
              isFrameProcessorEnabled ? frameProcessor : undefined
            }
            videoStabilizationMode="off"
            enableZoomGesture={enableZoomGesture}
            resizeMode="cover"
            style={styles.container}
            onError={console.error}
            onOutputOrientationChanged={onOutputOrientationChangedCallback}
            accessible={false}
            {...props}
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
