import { ModalBottomSheet } from '@swmansion/react-native-bottom-sheet';
import { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../providers/ThemeProvider';
import {
  useTerminalStore,
  type TerminalEntry,
} from '../../stores/terminalStore';
import { TerminalEntryRow, Text } from '../ui';

type TerminalBottomSheetProps = {
  index: number;
  onIndexChange: (index: number) => void;
};

const TerminalBottomSheet = ({
  index,
  onIndexChange,
}: TerminalBottomSheetProps) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const entries = useTerminalStore((state) => state.entries);
  const clear = useTerminalStore((state) => state.clear);

  const [wrapLines, setWrapLines] = useState(true);

  const detents = useMemo(
    () => [0, windowHeight * 0.25, windowHeight * 0.6, windowHeight * 0.9],
    [windowHeight]
  );

  const handleClose = useCallback(() => onIndexChange(0), [onIndexChange]);

  const renderItem = useCallback(
    ({ item }: { item: TerminalEntry }) => (
      <TerminalEntryRow entry={item} wrapLines={wrapLines} />
    ),
    [wrapLines]
  );

  const listEmpty = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Text variant="sm" style={{ color: theme.colors.text.secondary }}>
          No entries yet. Results will appear here.
        </Text>
      </View>
    ),
    [theme.colors.text.secondary]
  );

  const ItemSeparatorComponent = useMemo(
    () => <View style={styles.itemSeparator} />,
    []
  );

  const surface = useMemo(
    () => (
      <View
        style={[
          StyleSheet.absoluteFill,
          styles.surface,
          { backgroundColor: theme.colors.surface },
        ]}
      />
    ),
    [theme.colors.surface]
  );

  return (
    <ModalBottomSheet
      style={styles.sheetHost}
      detents={detents}
      index={index}
      onIndexChange={onIndexChange}
      surface={surface}
    >
      <View style={styles.handleContainer}>
        <View
          style={[
            styles.handleIndicator,
            {
              width: windowWidth * 0.075,
              backgroundColor: theme.colors.border,
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.header,
          { borderBottomColor: theme.colors.borderHairline },
        ]}
      >
        <View>
          <Text variant="lg">Terminal</Text>
          <Text variant="xs" style={{ color: theme.colors.text.secondary }}>
            {entries.length} entries
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable
            onPress={() => setWrapLines((prev) => !prev)}
            style={[styles.actionButton, { borderColor: theme.colors.border }]}
          >
            <Text variant="xs">Wrap {wrapLines ? 'On' : 'Off'}</Text>
          </Pressable>
          <Pressable
            onPress={clear}
            style={[styles.actionButton, { borderColor: theme.colors.border }]}
          >
            <Text variant="xs">Clear</Text>
          </Pressable>
          <Pressable
            onPress={handleClose}
            style={[styles.actionButton, { borderColor: theme.colors.border }]}
          >
            <Text variant="xs">Close</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={entries}
        keyExtractor={(item: TerminalEntry) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 16 },
        ]}
        ListEmptyComponent={listEmpty}
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        ItemSeparatorComponent={ItemSeparatorComponent}
      />
    </ModalBottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  surface: {
    borderRadius: 15,
  },
  sheetHost: {
    zIndex: 10,
    elevation: 10,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  handleIndicator: {
    height: 4,
    borderRadius: 4,
  },
  itemSeparator: {
    height: 12,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

export { TerminalBottomSheet };
