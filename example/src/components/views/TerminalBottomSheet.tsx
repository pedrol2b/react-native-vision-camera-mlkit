import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type ComponentProps,
} from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../providers/ThemeProvider';
import {
  useTerminalStore,
  type TerminalEntry,
} from '../../stores/terminalStore';
import { TerminalEntryRow, Text } from '../ui';

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type TerminalBottomSheetProps = Optional<
  ComponentProps<typeof BottomSheetModal>,
  'children'
>;

const TerminalBottomSheet = forwardRef<
  BottomSheetModal,
  TerminalBottomSheetProps
>((props, ref) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const entries = useTerminalStore((state) => state.entries);
  const clear = useTerminalStore((state) => state.clear);

  const [wrapLines, setWrapLines] = useState(true);

  const snapPoints = useMemo(() => ['25%', '60%', '90%'], []);

  const handleClose = useCallback(() => {
    if (!ref || typeof ref === 'function') return;
    ref.current?.dismiss();
  }, [ref]);

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

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      containerStyle={styles.modalContainer}
      topInset={insets.top}
      handleIndicatorStyle={{ backgroundColor: theme.colors.border }}
      backgroundStyle={{ backgroundColor: theme.colors.surface }}
      {...props}
    >
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
      <BottomSheetFlatList
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
    </BottomSheetModal>
  );
});

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
  modalContainer: {
    zIndex: 10,
    elevation: 10,
  },
  itemSeparator: {
    height: 12,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: 'center',
  },
});

TerminalBottomSheet.displayName = 'TerminalBottomSheet';

export { TerminalBottomSheet };
