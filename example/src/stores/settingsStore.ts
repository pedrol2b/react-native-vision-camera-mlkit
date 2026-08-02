import type {
  OrientationSource,
  TargetStabilizationMode,
} from 'react-native-vision-camera';
import { create } from 'zustand';

type PixelFormat = 'yuv' | 'rgb';

type SettingsState = {
  isFrameProcessorEnabled: boolean;
  setFrameProcessorEnabled: (enabled: boolean) => void;
  frameProcessorFps: number;
  setFrameProcessorFps: (fps: number) => void;
  pixelFormat: PixelFormat;
  setPixelFormat: (format: PixelFormat) => void;
  enableZoomGesture: boolean;
  setEnableZoomGesture: (enabled: boolean) => void;
  enableTapGesture: boolean;
  setEnableTapGesture: (enabled: boolean) => void;
  enableDoubleTapGesture: boolean;
  setEnableDoubleTapGesture: (enabled: boolean) => void;
  exposureBias: number;
  setExposureBias: (bias: number) => void;
  enableLowLightBoost: boolean;
  setEnableLowLightBoost: (enabled: boolean) => void;
  targetFps: number;
  setTargetFps: (fps: number) => void;
  videoStabilizationMode: TargetStabilizationMode;
  setVideoStabilizationMode: (mode: TargetStabilizationMode) => void;
  orientationSource: OrientationSource;
  setOrientationSource: (source: OrientationSource) => void;
};

export const useSettingsStore = create<SettingsState>((set) => ({
  isFrameProcessorEnabled: true,
  setFrameProcessorEnabled: (enabled: boolean) =>
    set({ isFrameProcessorEnabled: enabled }),
  frameProcessorFps: 15,
  setFrameProcessorFps: (fps: number) => set({ frameProcessorFps: fps }),
  pixelFormat: 'yuv',
  setPixelFormat: (format: PixelFormat) => set({ pixelFormat: format }),
  enableZoomGesture: true,
  setEnableZoomGesture: (enabled: boolean) =>
    set({ enableZoomGesture: enabled }),
  enableTapGesture: true,
  setEnableTapGesture: (enabled: boolean) => set({ enableTapGesture: enabled }),
  enableDoubleTapGesture: true,
  setEnableDoubleTapGesture: (enabled: boolean) =>
    set({ enableDoubleTapGesture: enabled }),
  exposureBias: 0,
  setExposureBias: (bias: number) => set({ exposureBias: bias }),
  enableLowLightBoost: false,
  setEnableLowLightBoost: (enabled: boolean) =>
    set({ enableLowLightBoost: enabled }),
  targetFps: 30,
  setTargetFps: (fps: number) => set({ targetFps: fps }),
  videoStabilizationMode: 'auto',
  setVideoStabilizationMode: (mode: TargetStabilizationMode) =>
    set({ videoStabilizationMode: mode }),
  orientationSource: 'device',
  setOrientationSource: (source: OrientationSource) =>
    set({ orientationSource: source }),
}));
