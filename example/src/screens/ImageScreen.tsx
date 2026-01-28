import {
  StackActions,
  useNavigation,
  useRoute,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { processImageTextRecognition } from 'react-native-vision-camera-mlkit';
import {
  Button,
  Divider,
  Section,
  SectionImageInput,
  SectionPicker,
  SectionSwitch,
  SectionTitle,
} from '../components/ui';
import { NoPluginErrorView, PortalSegmentedToggle } from '../components/views';
import { isPluginId, PLUGIN_ID } from '../constants/PLUGINS';
import { useCameraPermission, usePhotoPermission } from '../hooks';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { useTerminal } from '../providers/TerminalProvider';
import { useTheme } from '../providers/ThemeProvider';
import { ImagePicker } from '../services/ImagePicker';
import { useImageProcessingOptionsStore, useTerminalStore } from '../stores';

const IMAGE_PROCESSOR_MAP = {
  [PLUGIN_ID.TEXT_RECOGNITION]: processImageTextRecognition,
} as const;

const ImageScreen = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const { open: openTerminal } = useTerminal();

  const addEntry = useTerminalStore((state) => state.addEntry);

  const BOTTOM_OFFSET = insets.bottom + 46;

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { params, name } = useRoute<RouteProp<RootStackParamList, 'Image'>>();
  const pluginId = params.id;

  const ImageProcessor =
    IMAGE_PROCESSOR_MAP[pluginId as keyof typeof IMAGE_PROCESSOR_MAP];

  const {
    sharedOptions,
    setSharedOption,
    imageProcessingOptions,
    setImageProcessingOption,
  } = useImageProcessingOptionsStore();

  const [imageUri, setImageUri] = useState<string | null>(null);

  const { requestPermission: requestCameraPermission } = useCameraPermission();

  const { requestPermission: requestPhotoPermission } = usePhotoPermission();

  const processImageHandler = async () => {
    if (!imageUri) return;

    const options = {
      ...imageProcessingOptions[pluginId as keyof typeof IMAGE_PROCESSOR_MAP],
      ...sharedOptions,
    };

    try {
      const resultObject = await ImageProcessor(imageUri, options);

      console.log(resultObject);
      addEntry(resultObject, 'image');

      /** Opens the terminal after processing the image */
      openTerminal();
    } catch (error) {
      console.error(error);

      addEntry(
        {
          message: 'Error processing image',
          error: error instanceof Error ? error.message : String(error),
        },
        'image'
      );
    }
  };

  if (!isPluginId(params.id)) return <NoPluginErrorView />;

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContentContainer,
          { paddingBottom: BOTTOM_OFFSET },
        ]}
        removeClippedSubviews
      >
        <Section title="Image Processing">
          <SectionTitle
            title={params.title}
            description="Process ML Kit features on static images."
            align="center"
          />
          <SectionImageInput
            onTakePhoto={async () => {
              const granted = await requestCameraPermission();
              if (!granted) return;

              const uri = await ImagePicker.takePhoto();
              if (!uri) return;

              setImageUri(uri);
            }}
            onPickImage={async () => {
              const granted = await requestPhotoPermission();
              if (!granted) return;

              const uri = await ImagePicker.pickImage();
              if (!uri) return;

              setImageUri(uri);
            }}
          />
          {imageUri && (
            <View
              style={[
                styles.imageSection,
                { borderColor: theme.colors.border },
              ]}
            >
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          )}
          <Divider />
          <View style={styles.buttonsContainer}>
            <Button
              title="Process Image"
              variant="primary"
              size="sm"
              onPress={processImageHandler}
              disabled={!imageUri}
              style={styles.button}
            />
            <Button
              title="Open Terminal"
              variant="secondary"
              size="sm"
              onPress={openTerminal}
              style={styles.button}
            />
          </View>
          <SectionSwitch
            label="Invert Colors"
            description="Invert image colors for better text recognition on dark backgrounds."
            value={Boolean(sharedOptions.invertColors)}
            onValueChange={(value) => setSharedOption('invertColors', value)}
          />
          <SectionPicker
            label="Orientation"
            description="Set the image orientation for processing."
            value={sharedOptions.orientation ?? 'portrait'}
            options={[
              { label: 'portrait', value: 'portrait' },
              { label: 'portrait-upside-down', value: 'portrait-upside-down' },
              { label: 'landscape-left', value: 'landscape-left' },
              { label: 'landscape-right', value: 'landscape-right' },
            ]}
            onValueChange={(value) => setSharedOption('orientation', value)}
          />
          {pluginId === PLUGIN_ID.TEXT_RECOGNITION && (
            <SectionPicker
              label="Language"
              description="Select the language for text recognition."
              value={
                imageProcessingOptions[PLUGIN_ID.TEXT_RECOGNITION].language
              }
              options={[
                { label: 'Latin', value: 'LATIN' },
                { label: 'Chinese', value: 'CHINESE' },
                { label: 'Devanagari', value: 'DEVANAGARI' },
                { label: 'Japanese', value: 'JAPANESE' },
                { label: 'Korean', value: 'KOREAN' },
              ]}
              onValueChange={(value) =>
                setImageProcessingOption(
                  PLUGIN_ID.TEXT_RECOGNITION,
                  'language',
                  value as any
                )
              }
            />
          )}
        </Section>
      </ScrollView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 16,
  },
  imageSection: {
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
  },
  buttonsContainer: {
    gap: 8,
  },
  button: {
    marginHorizontal: 16,
  },
});

export { ImageScreen };
