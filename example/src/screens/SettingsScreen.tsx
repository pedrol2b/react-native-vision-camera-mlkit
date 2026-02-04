import { useRoute, type RouteProp } from '@react-navigation/native';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import type { BarcodeFormat } from 'react-native-vision-camera-mlkit';
import {
  Section,
  SectionPicker,
  SectionSlider,
  SectionSwitch,
} from '../components/ui';
import { PLUGIN_ID, pluginIdToName } from '../constants/PLUGINS';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { usePluginOptionsStore, useSettingsStore } from '../stores';

const BARCODE_FORMAT_OPTIONS: { label: string; value: BarcodeFormat }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Code 128', value: 'CODE_128' },
  { label: 'Code 39', value: 'CODE_39' },
  { label: 'Code 93', value: 'CODE_93' },
  { label: 'Codabar', value: 'CODABAR' },
  { label: 'Data Matrix', value: 'DATA_MATRIX' },
  { label: 'EAN-13', value: 'EAN_13' },
  { label: 'EAN-8', value: 'EAN_8' },
  { label: 'ITF', value: 'ITF' },
  { label: 'QR Code', value: 'QR_CODE' },
  { label: 'UPC-A', value: 'UPC_A' },
  { label: 'UPC-E', value: 'UPC_E' },
  { label: 'PDF417', value: 'PDF417' },
  { label: 'Aztec', value: 'AZTEC' },
  { label: 'Unknown', value: 'UNKNOWN' },
];

const normalizeBarcodeFormats = (formats: BarcodeFormat[]) => {
  if (formats.length === 0) return ['ALL'] as BarcodeFormat[];
  if (formats.includes('ALL') && formats.length > 1) {
    return formats.filter((format) => format !== 'ALL');
  }
  return formats;
};

const SettingsScreen = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Settings'>>();
  const pluginId = params.id;

  const {
    isFrameProcessorEnabled,
    setFrameProcessorEnabled,
    frameProcessorFps,
    setFrameProcessorFps,
    pixelFormat,
    setPixelFormat,
    enableZoomGesture,
    setEnableZoomGesture,
    enableTapGesture,
    setEnableTapGesture,
    enableDoubleTapGesture,
    setEnableDoubleTapGesture,
  } = useSettingsStore();

  const { sharedOptions, pluginOptions, setSharedOption, setPluginOption } =
    usePluginOptionsStore();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContentContainer}
      removeClippedSubviews
    >
      <Section title="Frame Processor">
        <SectionSwitch
          label="Enable Frame Processor"
          description="Frame Processors are JavaScript functions that are called for each Frame the Camera &ldquo;sees&rdquo;."
          value={isFrameProcessorEnabled}
          onValueChange={setFrameProcessorEnabled}
        />
        <SectionSlider
          label="Frame Processor FPS (runAtTargetFps)"
          description="Controls how often the frame processor runs."
          value={frameProcessorFps}
          min={1}
          max={30}
          step={1}
          onValueChange={setFrameProcessorFps}
        />
      </Section>

      <Section title="Plugin Options" description={pluginIdToName[pluginId]}>
        <SectionSwitch
          label="Invert Colors"
          description="Invert image colors for better text recognition on dark backgrounds."
          value={Boolean(sharedOptions.invertColors)}
          onValueChange={(value) => setSharedOption('invertColors', value)}
        />
        <SectionPicker
          label="Frame Process Interval"
          description="Process 1 frame, skip N frames, repeat. Note: Using runAtTargetFps() in your frame processor is recommended instead."
          value={String(sharedOptions.frameProcessInterval)}
          options={[
            { label: '0 (Every frame)', value: '0' },
            { label: '1 (Every 2nd)', value: '1' },
            { label: '2 (Every 3rd)', value: '2' },
            { label: '3 (Every 4th)', value: '3' },
            { label: '4 (Every 5th)', value: '4' },
            { label: '5 (Every 6th)', value: '5' },
          ]}
          onValueChange={(value) =>
            setSharedOption('frameProcessInterval', Number(value))
          }
        />
        <SectionSlider
          label="Scale Factor"
          description="Downscales the image for faster processing. Clamped to 0.9-1.0 to preserve ML accuracy."
          value={
            typeof sharedOptions.scaleFactor === 'number'
              ? sharedOptions.scaleFactor
              : 1.0
          }
          min={0.9}
          max={1.0}
          step={0.01}
          onValueChange={(value) => setSharedOption('scaleFactor', value)}
        />
        {pluginId === PLUGIN_ID.TEXT_RECOGNITION && (
          <SectionPicker
            label="Language"
            description="Select the language for text recognition."
            value={
              pluginOptions[PLUGIN_ID.TEXT_RECOGNITION].language ?? 'LATIN'
            }
            options={[
              { label: 'Latin', value: 'LATIN' },
              { label: 'Chinese', value: 'CHINESE' },
              { label: 'Devanagari', value: 'DEVANAGARI' },
              { label: 'Japanese', value: 'JAPANESE' },
              { label: 'Korean', value: 'KOREAN' },
            ]}
            onValueChange={(value) =>
              setPluginOption(
                PLUGIN_ID.TEXT_RECOGNITION,
                'language',
                value as any
              )
            }
          />
        )}
        {pluginId === PLUGIN_ID.BARCODE_SCANNING && (
          <>
            <SectionPicker
              label="Barcode Formats"
              description="Select one or more barcode formats to scan."
              value={
                pluginOptions[PLUGIN_ID.BARCODE_SCANNING].formats ?? ['ALL']
              }
              options={BARCODE_FORMAT_OPTIONS}
              multiple
              onValueChange={(value) =>
                setPluginOption(
                  PLUGIN_ID.BARCODE_SCANNING,
                  'formats',
                  normalizeBarcodeFormats(value as BarcodeFormat[])
                )
              }
            />
            <SectionSwitch
              label="Enable All potential barcodes (Android only)"
              description="Enables detection of all supported barcode formats. May impact performance."
              value={Boolean(
                pluginOptions[PLUGIN_ID.BARCODE_SCANNING]
                  .enableAllPotentialBarcodes
              )}
              onValueChange={(value) =>
                setPluginOption(
                  PLUGIN_ID.BARCODE_SCANNING,
                  'enableAllPotentialBarcodes',
                  value
                )
              }
              disabled={Platform.OS !== 'android'}
            />
          </>
        )}
      </Section>

      <Section title="Camera Behavior">
        <SectionPicker
          label="Pixel Format"
          description="Choose the pixel format for camera frames. YUV is recommended for better performance."
          value={pixelFormat}
          options={[
            { label: 'YUV', value: 'yuv' },
            { label: 'RGB', value: 'rgb' },
          ]}
          onValueChange={setPixelFormat}
        />
        <SectionSwitch
          label="Enable Zoom Gesture"
          description="Allow pinch-to-zoom gesture on the camera view."
          value={enableZoomGesture}
          onValueChange={setEnableZoomGesture}
        />
        <SectionSwitch
          label="Enable Tap to Focus"
          description="Allow tap gesture to focus the camera."
          value={enableTapGesture}
          onValueChange={setEnableTapGesture}
        />
        <SectionSwitch
          label="Enable Double Tap to Flip"
          description="Allow double tap gesture to flip the camera."
          value={enableDoubleTapGesture}
          onValueChange={setEnableDoubleTapGesture}
        />
      </Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
});

export { SettingsScreen };
