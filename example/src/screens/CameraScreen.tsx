import {
  StackActions,
  useIsFocused,
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';
import {
  type CameraRef,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import type { Orientation } from 'react-native-vision-camera-mlkit';
import { CameraControls } from '../components/ui';
import {
  CameraView,
  NoCameraPermissionErrorView,
  NoDeviceErrorView,
  NoPluginErrorView,
  PortalSegmentedToggle,
} from '../components/views';
import { isPluginId } from '../constants/PLUGINS';
import { useAppState } from '../hooks';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useTerminal } from '../providers/TerminalProvider';
import { useSettingsStore } from '../stores';

type CameraPosition = 'back' | 'front';

type TorchState = 'off' | 'on';

const DEFAULT_ORIENTATION: Orientation = 'portrait';

const CameraScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { params, name } = useRoute<RouteProp<RootStackParamList, 'Camera'>>();
  const { open: openTerminal } = useTerminal();

  const cameraRef = useRef<CameraRef>(null);

  const [cameraPosition, setCameraPosition] = useState<CameraPosition>('back');
  const [torchState, setTorchState] = useState<TorchState>('off');
  const [, setIsFpsGraphEnabled] = useState<boolean>(false);

  const outputOrientation = useSharedValue<Orientation>(DEFAULT_ORIENTATION);

  const { isFrameProcessorEnabled } = useSettingsStore();

  const {
    hasPermission: hasCameraPermission,
    requestPermission: requestCameraPermission,
  } = useCameraPermission();

  const isFocused = useIsFocused();
  const appState = useAppState();

  const isActive = isFocused && appState === 'active';

  const flipCamera = () =>
    setCameraPosition((prev) => (prev === 'back' ? 'front' : 'back'));

  const toggleTorch = () =>
    setTorchState((prev) => (prev === 'off' ? 'on' : 'off'));

  const toggleFpsGraph = () => setIsFpsGraphEnabled((prev) => !prev);

  const openSettings = () =>
    navigation.navigate('Settings', { id: params.id, title: 'Settings' });

  const device = useCameraDevice(cameraPosition);

  useEffect(() => {
    !hasCameraPermission && requestCameraPermission();
  }, [hasCameraPermission, requestCameraPermission]);

  if (!hasCameraPermission) return <NoCameraPermissionErrorView />;
  if (!device) return <NoDeviceErrorView />;
  if (!isPluginId(params.id)) return <NoPluginErrorView />;

  return (
    <>
      <CameraView
        ref={cameraRef}
        device={device}
        isActive={isActive}
        pluginId={params.id}
        flipCamera={flipCamera}
        isFrameProcessorEnabled={isFrameProcessorEnabled}
        frameOutputOrientation={outputOrientation}
        torchMode={torchState}
      />
      <CameraControls
        onFlipCamera={flipCamera}
        torch={torchState}
        onToggleTorch={toggleTorch}
        onToggleFpsGraph={toggleFpsGraph}
        onOpenTerminal={openTerminal}
        onOpenSettings={openSettings}
        outputOrientation={outputOrientation}
      />
      <PortalSegmentedToggle
        value={name}
        onChange={(v) =>
          v !== name && navigation.dispatch(StackActions.replace(v, params))
        }
        options={[
          { label: 'Camera', value: 'Camera' },
          { label: 'Image', value: 'Image' },
        ]}
      />
    </>
  );
};

export { CameraScreen };
