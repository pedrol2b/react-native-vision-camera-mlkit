import { useRoute, type RouteProp } from '@react-navigation/native';
import { ScrollView, StyleSheet } from 'react-native';
import {
  RegionOfInterestControl,
  Section,
  SectionPicker,
  SectionSlider,
  SectionSwitch,
} from '../components/ui';
import { PLUGIN_ID, pluginIdToName } from '../constants/PLUGINS';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { usePluginOptionsStore, useSettingsStore } from '../stores';

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
    exposureBias,
    setExposureBias,
    enableLowLightBoost,
    setEnableLowLightBoost,
    targetFps,
    setTargetFps,
    videoStabilizationMode,
    setVideoStabilizationMode,
    orientationSource,
    setOrientationSource,
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
          label="ML Processing Rate"
          description="Skips frames between ML Kit runs to control how often the frame processor actually processes a frame."
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
            <SectionSwitch
              label="Enable Potential Barcodes"
              description="Return potential barcodes that are not fully decoded yet."
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
            />
            <SectionPicker
              label="Barcode Format"
              description="Filter barcode formats for better performance."
              value={
                pluginOptions[PLUGIN_ID.BARCODE_SCANNING].formats?.length
                  ? pluginOptions[PLUGIN_ID.BARCODE_SCANNING].formats?.[0] ??
                    'ALL_FORMATS'
                  : 'ALL_FORMATS'
              }
              options={[
                { label: 'All formats', value: 'ALL_FORMATS' },
                { label: 'QR Code', value: 'QR_CODE' },
                { label: 'Aztec', value: 'AZTEC' },
                { label: 'Code 128', value: 'CODE_128' },
                { label: 'Code 39', value: 'CODE_39' },
                { label: 'Code 93', value: 'CODE_93' },
                { label: 'Codabar', value: 'CODABAR' },
                { label: 'Data Matrix', value: 'DATA_MATRIX' },
                { label: 'EAN-13', value: 'EAN_13' },
                { label: 'EAN-8', value: 'EAN_8' },
                { label: 'ITF', value: 'ITF' },
                { label: 'UPC-A', value: 'UPC_A' },
                { label: 'UPC-E', value: 'UPC_E' },
                { label: 'PDF417', value: 'PDF417' },
              ]}
              onValueChange={(value) =>
                setPluginOption(
                  PLUGIN_ID.BARCODE_SCANNING,
                  'formats',
                  value === 'ALL_FORMATS' ? [] : [value as any]
                )
              }
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
        <SectionSlider
          label="Exposure Bias"
          description="Adjusts camera exposure. Negative values darken the image, positive values brighten it. Clamped to the device's supported range."
          value={exposureBias}
          min={-3}
          max={3}
          step={0.1}
          onValueChange={setExposureBias}
        />
        <SectionSwitch
          label="Low Light Boost"
          description="Extends exposure time in dark scenes for a brighter image, if the device supports it."
          value={enableLowLightBoost}
          onValueChange={setEnableLowLightBoost}
        />
        <SectionPicker
          label="Target FPS"
          description="Preferred camera capture frame rate. VisionCamera negotiates the closest supported rate."
          value={String(targetFps)}
          options={[
            { label: '15 FPS', value: '15' },
            { label: '24 FPS', value: '24' },
            { label: '30 FPS', value: '30' },
            { label: '60 FPS', value: '60' },
            { label: '120 FPS', value: '120' },
          ]}
          onValueChange={(value) => setTargetFps(Number(value))}
        />
        <SectionPicker
          label="Video Stabilization"
          description="Preferred stabilization mode for the camera pipeline."
          value={videoStabilizationMode}
          options={[
            { label: 'Off', value: 'off' },
            { label: 'Auto', value: 'auto' },
            { label: 'Standard', value: 'standard' },
            { label: 'Cinematic', value: 'cinematic' },
            { label: 'Cinematic Extended', value: 'cinematic-extended' },
            {
              label: 'Cinematic Extended Enhanced',
              value: 'cinematic-extended-enhanced',
            },
            { label: 'Preview Optimized', value: 'preview-optimized' },
            { label: 'Low Latency', value: 'low-latency' },
          ]}
          onValueChange={(value) =>
            setVideoStabilizationMode(value as typeof videoStabilizationMode)
          }
        />
        <SectionPicker
          label="Orientation Source"
          description="Whether output orientation follows the app's UI orientation or the phone's physical orientation."
          value={orientationSource}
          options={[
            { label: 'Interface', value: 'interface' },
            { label: 'Device', value: 'device' },
          ]}
          onValueChange={(value) =>
            setOrientationSource(value as typeof orientationSource)
          }
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

      <Section
        title="Region of Interest"
        description="Crop ML Kit processing to a rectangle of the frame."
      >
        <RegionOfInterestControl
          value={sharedOptions.roi}
          onValueChange={(roi) => setSharedOption('roi', roi)}
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
