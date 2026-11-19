import type {
  BarcodeScanningImageOptions,
  ImageProcessingBaseOptions as SharedImageProcessingOptions,
  ObjectDetectionImageOptions,
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
  [PLUGIN_ID.OBJECT_DETECTION]: Pick<
    ObjectDetectionImageOptions,
    'shouldEnableMultipleObjects' | 'shouldEnableClassification'
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
      orientation: undefined,
    },
    imageProcessingOptions: {
      [PLUGIN_ID.TEXT_RECOGNITION]: {
        language: 'LATIN',
      },
      [PLUGIN_ID.BARCODE_SCANNING]: {
        formats: [],
        enableAllPotentialBarcodes: false,
      },
      [PLUGIN_ID.OBJECT_DETECTION]: {
        shouldEnableMultipleObjects: true,
        shouldEnableClassification: false,
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
