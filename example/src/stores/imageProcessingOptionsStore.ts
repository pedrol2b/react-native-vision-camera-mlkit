import type {
  BarcodeScanningImageOptions,
  ImageProcessingBaseOptions as SharedImageProcessingOptions,
  TextRecognitionImageOptions,
} from 'react-native-vision-camera-mlkit';
import { create } from 'zustand';
import { PLUGIN_ID } from '../constants/PLUGINS';

type SpecificImageProcessingOptions = {
  [PLUGIN_ID.TEXT_RECOGNITION]: Pick<TextRecognitionImageOptions, 'language'>;
  [PLUGIN_ID.BARCODE_SCANNING]: Pick<
    BarcodeScanningImageOptions,
    'formats' | 'enableAllPotentialBarcodes'
  >;
};

type ImageProcessingOptionsState = {
  sharedOptions: SharedImageProcessingOptions;
  imageProcessingOptions: SpecificImageProcessingOptions;
  setSharedOption: <K extends keyof SharedImageProcessingOptions>(
    key: K,
    value: SharedImageProcessingOptions[K]
  ) => void;
  setImageProcessingOption: <
    P extends keyof SpecificImageProcessingOptions,
    K extends keyof SpecificImageProcessingOptions[P]
  >(
    pluginId: P,
    key: K,
    value: SpecificImageProcessingOptions[P][K]
  ) => void;
};

export const useImageProcessingOptionsStore =
  create<ImageProcessingOptionsState>((set) => ({
    sharedOptions: {
      invertColors: false,
      orientation: 'portrait',
    },
    imageProcessingOptions: {
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
    setImageProcessingOption: (pluginId, key, value) =>
      set((state) => ({
        imageProcessingOptions: {
          ...state.imageProcessingOptions,
          [pluginId]: {
            ...state.imageProcessingOptions[pluginId],
            [key]: value,
          },
        },
      })),
  }));
