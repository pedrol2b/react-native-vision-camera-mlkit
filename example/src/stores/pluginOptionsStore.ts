import type {
  BarcodeScanningOptions,
  MLKitBaseOptions as SharedPluginOptions,
  TextRecognitionOptions,
} from 'react-native-vision-camera-mlkit';
import { create } from 'zustand';
import { PLUGIN_ID } from '../constants/PLUGINS';

type SpecificPluginOptions = {
  [PLUGIN_ID.TEXT_RECOGNITION]: Pick<TextRecognitionOptions, 'language'>;
  [PLUGIN_ID.BARCODE_SCANNING]: Pick<
    BarcodeScanningOptions,
    'formats' | 'enableAllPotentialBarcodes'
  >;
};

type PluginOptionsState = {
  sharedOptions: SharedPluginOptions;
  pluginOptions: SpecificPluginOptions;
  setSharedOption: <K extends keyof SharedPluginOptions>(
    key: K,
    value: SharedPluginOptions[K]
  ) => void;
  setPluginOption: <
    P extends keyof SpecificPluginOptions,
    K extends keyof SpecificPluginOptions[P]
  >(
    pluginId: P,
    key: K,
    value: SpecificPluginOptions[P][K]
  ) => void;
};

export const usePluginOptionsStore = create<PluginOptionsState>((set) => ({
  sharedOptions: {
    invertColors: false,
    frameProcessInterval: 0,
    scaleFactor: 1.0,
  },
  pluginOptions: {
    [PLUGIN_ID.TEXT_RECOGNITION]: {
      language: 'LATIN',
    },
    [PLUGIN_ID.BARCODE_SCANNING]: {
      formats: ['ALL'],
      enableAllPotentialBarcodes: false,
    },
  },
  setSharedOption: (key, value) =>
    set((state) => ({
      sharedOptions: {
        ...state.sharedOptions,
        [key]: value,
      },
    })),
  setPluginOption: (pluginId, key, value) =>
    set((state) => ({
      pluginOptions: {
        ...state.pluginOptions,
        [pluginId]: {
          ...state.pluginOptions[pluginId],
          [key]: value,
        },
      },
    })),
}));
