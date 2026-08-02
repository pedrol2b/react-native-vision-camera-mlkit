import {
  forwardRef,
  useCallback,
  useEffect,
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
  useFrameOutput,
  type CameraDevice,
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
import { FpsGraphOverlay } from './FpsGraphOverlay';
import { ROIOverlay } from './ROIOverlay';

const normalizeResultObject = (data: unknown) => {
  if (data === null || data === undefined) return data;

  if (typeof data !== 'object') return data;

  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return String(data);
  }
};

const FPS_SAMPLE_INTERVAL_MS = 500;
const FPS_HISTORY_LENGTH = 20;
const FPS_GRAPH_MAX_SCALE = 60;

type CameraViewProps = Omit<ComponentProps<typeof Camera>, 'device'> & {
  device: CameraDevice;
  pluginId: PLUGIN_ID;
  flipCamera: () => void;
  isFrameProcessorEnabled?: boolean;
  isFpsGraphEnabled?: boolean;
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
      isFpsGraphEnabled = false,
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
      exposureBias,
      enableLowLightBoost,
      targetFps,
      videoStabilizationMode,
      orientationSource,
    } = useSettingsStore();
    const { sharedOptions, pluginOptions } = usePluginOptionsStore();

    const frameArrivalCount = useSharedValue(0);
    const [fps, setFps] = useState(0);
    const [fpsHistory, setFpsHistory] = useState<number[]>([]);

    useEffect(() => {
      if (!isFpsGraphEnabled) return;

      const interval = setInterval(() => {
        const framesSinceLastSample = frameArrivalCount.value;
        frameArrivalCount.value = 0;

        const instantaneousFps = Math.round(
          (framesSinceLastSample * 1000) / FPS_SAMPLE_INTERVAL_MS
        );

        setFps(instantaneousFps);
        setFpsHistory((prev) =>
          [...prev, instantaneousFps].slice(-FPS_HISTORY_LENGTH)
        );
      }, FPS_SAMPLE_INTERVAL_MS);

      return () => clearInterval(interval);
    }, [isFpsGraphEnabled, frameArrivalCount]);

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
    const zoom = useSharedValue(device?.minZoom ?? 1);
    const savedZoom = useSharedValue(device?.minZoom ?? 1);
    const exposure = useSharedValue(0);

    useEffect(() => {
      zoom.value = device?.minZoom ?? 1;
    }, [device, zoom]);

    useEffect(() => {
      if (!device?.supportsExposureBias) {
        exposure.value = 0;
        return;
      }

      exposure.value = Math.min(
        Math.max(exposureBias, device.minExposureBias),
        device.maxExposureBias
      );
    }, [device, exposureBias, exposure]);

    const frameInterval = useMemo(
      () => Math.max(1, Math.round(30 / frameProcessorFps)),
      [frameProcessorFps]
    );

    const focus = useCallback(
      (point: { x: number; y: number }) => {
        if (typeof ref === 'function' || !ref?.current) return;

        ref.current.focusTo(point).catch((error: Error) => {
          // A new focus request cancels any still-settling previous one -
          // this is expected whenever the user taps again quickly.
          if (error.message.includes('canceled')) return;
          console.error(error);
        });
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

    const pinchGesture = Gesture.Pinch()
      .onStart(() => {
        savedZoom.value = zoom.value;
      })
      .onUpdate((event) => {
        if (!device) return;
        const nextZoom = savedZoom.value * event.scale;
        zoom.value = Math.min(
          Math.max(nextZoom, device.minZoom),
          device.maxZoom
        );
      });

    const gestures = [];
    if (enableDoubleTapGesture) gestures.push(doubleTapGesture);
    if (enableTapGesture) gestures.push(tapGesture);

    const tapGestureComposition =
      gestures.length > 0 ? Gesture.Exclusive(...gestures) : Gesture.Tap();

    const gesture = enableZoomGesture
      ? Gesture.Simultaneous(pinchGesture, tapGestureComposition)
      : tapGestureComposition;

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

        frameArrivalCount.value += 1;

        if (!isFrameProcessorEnabled) {
          frame.dispose();
          return;
        }

        frameCount.value = (frameCount.value + 1) % frameInterval;
        if (frameCount.value !== 0) {
          frame.dispose();
          return;
        }

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
            {...(enableLowLightBoost && device?.supportsLowLightBoost
              ? { enableLowLightBoost: true }
              : {})}
            ref={ref}
            device={device}
            isActive={isActive}
            outputs={[frameOutput]}
            constraints={[
              { resolutionBias: frameOutput },
              { fps: targetFps },
              { videoStabilizationMode },
            ]}
            torchMode={torchMode}
            zoom={zoom}
            exposure={exposure}
            orientationSource={orientationSource}
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
          {isFpsGraphEnabled && (
            <FpsGraphOverlay
              fps={fps}
              history={fpsHistory}
              maxFps={FPS_GRAPH_MAX_SCALE}
            />
          )}
          {sharedOptions.roi && <ROIOverlay roi={sharedOptions.roi} />}
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
