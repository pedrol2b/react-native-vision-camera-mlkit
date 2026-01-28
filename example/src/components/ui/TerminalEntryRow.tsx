import { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { type TerminalEntry } from '../../stores/terminalStore';
import { formatTimestamp } from '../../utils/formatTimestamp';
import {
  type StringifyOptions,
  safeStringify,
} from '../../utils/safeStringify';
import { Text } from '../ui/Text';

const monospaceFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

const PREVIEW_OPTIONS: StringifyOptions = {
  maxDepth: 3,
  maxArrayLength: 24,
  maxObjectKeys: 24,
  maxStringLength: 200,
  maxTotalLength: 1200,
};

const FULL_OPTIONS: StringifyOptions = {
  maxDepth: 6,
  maxArrayLength: 120,
  maxObjectKeys: 120,
  maxStringLength: 1200,
  maxTotalLength: 12000,
};

type TerminalEntryRowProps = {
  entry: TerminalEntry;
  wrapLines: boolean;
};

const TerminalEntryRow = ({ entry, wrapLines }: TerminalEntryRowProps) => {
  const { theme } = useTheme();

  const preview = useMemo(
    () => safeStringify(entry.data, PREVIEW_OPTIONS),
    [entry.data]
  );

  const full = useMemo(
    () => safeStringify(entry.data, FULL_OPTIONS),
    [entry.data]
  );

  const [isExpanded, setIsExpanded] = useState(() => !preview.truncated);

  const content = isExpanded ? full : preview;

  return (
    <View style={[styles.entryContainer, { borderColor: theme.colors.border }]}>
      <View style={styles.entryHeader}>
        <View style={styles.entryMeta}>
          <Text
            variant="xs"
            style={[
              styles.entryMetaText,
              { color: theme.colors.text.secondary },
            ]}
          >
            {formatTimestamp(entry.ts)}
          </Text>
          <Text variant="xs" style={{ color: theme.colors.text.secondary }}>
            {entry.source}
          </Text>
        </View>
        <Pressable onPress={() => setIsExpanded((prev) => !prev)}>
          <Text variant="xs" style={{ color: theme.colors.primary }}>
            {isExpanded ? 'COLLAPSE' : 'EXPAND'}
          </Text>
        </Pressable>
      </View>
      {wrapLines ? (
        <Text
          variant="sm"
          style={[styles.entryText, { color: theme.colors.text.primary }]}
        >
          {content.text}
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text
            variant="sm"
            style={[styles.entryText, { color: theme.colors.text.primary }]}
          >
            {content.text}
          </Text>
        </ScrollView>
      )}
      {content.truncated && (
        <Text
          variant="xs"
          style={[styles.truncatedNote, { color: theme.colors.text.secondary }]}
        >
          Output truncated for performance.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  entryContainer: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  entryMetaText: {
    marginRight: 8,
  },
  entryText: {
    fontFamily: monospaceFont,
    marginTop: 8,
  },
  truncatedNote: {
    marginTop: 6,
  },
});

export { TerminalEntryRow };
