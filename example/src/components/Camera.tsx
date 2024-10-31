import React, {
  type ComponentProps,
  forwardRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Camera as RNVCCamera,
  runAsync,
  Templates,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';

Reanimated.addWhitelistedNativeProps({ zoom: true });

const ReanimatedCamera = Reanimated.createAnimatedComponent(RNVCCamera);

export type TorchState = 'on' | 'off';

type CameraProps = Omit<
  ComponentProps<typeof RNVCCamera>,
  'device' | 'isActive'
>;

const Camera = forwardRef<RNVCCamera, CameraProps>((props, ref) => {
  const { hasPermission, requestPermission } = useCameraPermission();

  const [targetFps] = useState(60);
  const [fpsGraphEnabled, setFpsGraphEnabled] = useState(false);

  /**
   * Faster Camera Device
   *
   * https://react-native-vision-camera.com/docs/guides/performance#simpler-camera-device
   */
  const device = useCameraDevice('back', {
    physicalDevices: ['wide-angle-camera'],
  });

  const format = useCameraFormat(device, Templates.Snapchat);

  const fps = useMemo(
    () => Math.min(format?.maxFps ?? 1, targetFps),
    [format?.maxFps, targetFps]
  );

  const neutralZoom = device?.neutralZoom ?? 1;
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = device?.maxZoom ?? 1;

  const zoom = useSharedValue(neutralZoom);
  const zoomOffset = useSharedValue(neutralZoom);

  /** ZOOM Pan Gesture */
  const panGesture = Gesture.Pan()
    .onBegin(() => {
      zoomOffset.value = zoom.value;
    })
    .onUpdate((event) => {
      const verticalTranslation = -event.translationY;
      const zoomChange = verticalTranslation / 200; // Adjust the denominator to control sensitivity
      zoom.value = interpolate(
        zoomOffset.value + zoomChange,
        [minZoom, maxZoom],
        [minZoom, maxZoom],
        Extrapolation.CLAMP
      );
    })
    .onEnd(() => {
      if (zoom.value < neutralZoom) {
        zoom.value = withSpring(neutralZoom, { damping: 10, stiffness: 100 });
      }
    });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const toggleFpsGraphEnabled = () => setFpsGraphEnabled((enabled) => !enabled);

  const animatedProps = useAnimatedProps(() => ({ zoom: zoom.value }), [zoom]);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAsync(frame, () => {
      'worklet';
    });
  }, []);

  useEffect(() => {
    !hasPermission && requestPermission();
  }, [hasPermission, requestPermission]);

  if (!device || !hasPermission) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <ReanimatedCamera
        ref={ref}
        device={device}
        isActive={true}
        fps={fps}
        zoom={zoom.value}
        pixelFormat="yuv"
        format={format}
        enableFpsGraph={fpsGraphEnabled}
        onError={console.error}
        enableBufferCompression={true}
        videoStabilizationMode="off"
        frameProcessor={frameProcessor}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        animatedProps={animatedProps}
        {...props}
      />
    </GestureDetector>
  );
});

export { Camera };
