import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { useCallback, useDeferredValue, useMemo, useState } from 'react';
import { FlatList, Keyboard, StyleSheet, TextInput, View } from 'react-native';
import { GithubFab, LinkCard } from '../components/ui';
import type { LinkCardProps } from '../components/ui/LinkCard';
import { PLUGIN_ID } from '../constants/PLUGINS';
import type {
  CameraParams,
  RootStackParamList,
} from '../navigation/RootNavigator';
import { useTheme } from '../providers/ThemeProvider';
import { typography } from '../styles/themes';

const BASE_DATA: Array<Omit<LinkCardProps, 'onPress'>> = [
  {
    id: PLUGIN_ID.TEXT_RECOGNITION,
    title: 'Text recognition v2',
    description:
      'Extract text from images in 80+ languages including Latin, Chinese, Japanese, Korean, and Devanagari scripts',
    isBeta: false,
    android: true,
    ios: true,
    status: 'complete',
  },
  {
    id: PLUGIN_ID.FACE_DETECTION,
    title: 'Face detection',
    description:
      'Detect faces and identify key facial features, contours, and landmarks in real-time',
    isBeta: false,
    android: true,
    ios: true,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.FACE_MESH_DETECTION,
    title: 'Face mesh detection',
    description:
      'Detect detailed 3D face mesh with 468 points for advanced facial tracking and AR effects',
    isBeta: true,
    android: true,
    ios: false,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.POSE_DETECTION,
    title: 'Pose detection',
    description:
      'Detect body pose and track 33 key skeletal points for fitness, dance, and AR applications',
    isBeta: true,
    android: true,
    ios: true,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.SEGMENTATION_SELFIE,
    title: 'Selfie segmentation',
    description:
      'Separate person from background in selfie images for virtual backgrounds and effects',
    isBeta: true,
    android: true,
    ios: true,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.SEGMENTATION_SUBJECT,
    title: 'Subject segmentation',
    description:
      'Isolate primary subjects from backgrounds with precise edge detection for photo editing',
    isBeta: true,
    android: true,
    ios: false,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.DOCUMENT_SCANNER,
    title: 'Document scanner',
    description:
      'Scan and digitize physical documents with auto-cropping and perspective correction',
    isBeta: false,
    android: true,
    ios: false,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.BARCODE_SCANNING,
    title: 'Barcode scanning',
    description:
      'Scan and decode QR codes, UPC, EAN, and other 1D/2D barcode formats instantly',
    isBeta: false,
    android: true,
    ios: true,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.IMAGE_LABELING,
    title: 'Image labeling',
    description:
      'Identify and label objects, locations, activities, and concepts in images with confidence scores',
    isBeta: false,
    android: true,
    ios: true,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.OBJECT_DETECTION,
    title: 'Object detection and tracking',
    description:
      'Detect and track multiple objects in real-time with bounding boxes and tracking IDs',
    isBeta: false,
    android: true,
    ios: true,
    status: 'in-progress',
  },
  {
    id: PLUGIN_ID.DIGITAL_INK_RECOGNITION,
    title: 'Digital ink recognition',
    description:
      'Recognize handwritten text and drawings in over 300 languages with stroke data',
    isBeta: false,
    android: true,
    ios: true,
    status: 'in-progress',
  },
];

const createData = (
  navigate: (screen: string, params: CameraParams) => void
): LinkCardProps[] =>
  BASE_DATA.map((item) => ({
    ...item,
    onPress: () => navigate('Camera', { id: item.id, title: item.title }),
  }));

const ITEM_HEIGHT = 120;
const ITEM_GAP = 8;

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const data = useMemo(
    () =>
      createData((screen, params) =>
        (navigation.navigate as (screen: string, params: CameraParams) => void)(
          screen,
          params
        )
      ),
    [navigation]
  );

  const [searchQuery, setSearchQuery] = useState('');
  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredData = useMemo(() => {
    if (!deferredSearchQuery.trim()) {
      return data;
    }

    const query = deferredSearchQuery.toLowerCase();
    return data.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query)
    );
  }, [deferredSearchQuery, data]);

  const renderItem = useCallback(
    ({ item }: { item: LinkCardProps }) => <LinkCard {...item} />,
    []
  );

  const keyExtractor = useCallback(
    (item: LinkCardProps, index: number) =>
      String(item.id) ?? `${item.title}-${index}`,
    []
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<LinkCardProps> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: (ITEM_HEIGHT + ITEM_GAP) * index,
      index,
    }),
    []
  );

  const handleSearchSubmit = useCallback(() => Keyboard.dismiss(), []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Search
            size={20}
            color={theme.colors.text.secondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[
              styles.searchInput,
              {
                color: theme.colors.text.primary,
              },
            ]}
            placeholder="Search APIs..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            enablesReturnKeyAutomatically
            onSubmitEditing={handleSearchSubmit}
            clearButtonMode="while-editing"
            maxLength={100}
            selectTextOnFocus
            accessibilityLabel="Search APIs"
            accessibilityHint="Type to filter the list of ML Kit APIs"
            accessibilityRole="search"
          />
        </View>
      </View>
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        contentContainerStyle={styles.contentContainer}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
      />
      <GithubFab />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    rowGap: ITEM_GAP,
  },
  searchContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    paddingVertical: 8,
    ...typography.md,
  },
});

export { HomeScreen };
