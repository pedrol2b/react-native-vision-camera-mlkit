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
}));
