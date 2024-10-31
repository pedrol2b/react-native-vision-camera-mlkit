import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import type { Camera as RNVCCamera } from 'react-native-vision-camera';
import { Camera } from './components/Camera';

export default function App() {
  const camera = useRef<RNVCCamera>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <BottomSheetModalProvider>
          <Camera ref={camera} />
        </BottomSheetModalProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
