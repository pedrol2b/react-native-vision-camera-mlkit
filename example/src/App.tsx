import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Camera,
  Templates,
  runAsync,
  useCameraDevice,
  useCameraFormat,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import * as plugins from 'react-native-vision-camera-mlkit';

export default function App() {
  const [targetFps] = useState(60);

  const camera = useRef<Camera>(null);

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { textRecognizer } = plugins.useTextRecognizer({ language: 'LATIN' });

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { barcodeScanner } = plugins.useBarcodeScanner({
    formats: ['QR_CODE', 'AZTEC'],
    enableAllPotentialBarcodes: false,
    invertColors: false,
  });

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { imageLabeler } = plugins.useImageLabeler({
    confidenceThreshold: 60,
  });

  const { objectDetector } = plugins.useObjectDetector({
    enableMultipleObjects: true,
    enableClassification: true,
  });

  const { hasPermission, requestPermission } = useCameraPermission();

  const device = useCameraDevice('back');
  const format = useCameraFormat(device, Templates.FrameProcessing);

  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';

    runAsync(frame, () => {
      'worklet';
      // const text = textRecognizer(frame);
      // console.log(text);

      // const barcodes = barcodeScanner(frame);
      // console.log(barcodes);

      // const labels = imageLabeler(frame);
      // console.log(labels);

      const objects = objectDetector(frame);
      console.log(objects);
    });
  }, []);

  useEffect(() => {
    !hasPermission && requestPermission();
  }, [hasPermission, requestPermission]);

  if (!device || !hasPermission) return null;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        fps={fps}
        zoom={1}
        isActive={true}
        pixelFormat="yuv"
        device={device}
        orientation="portrait"
        format={format}
        torch={'off'}
        enableFpsGraph={true}
        frameProcessor={frameProcessor}
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
        onError={console.error}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
