import { useMemo } from 'react';
import { StyleSheet, View, type TextStyle, type ViewStyle } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

type Alignment = 'start' | 'center' | 'end';

export type SectionTitleProps = {
  title: string;
  description?: string;
  align?: Alignment;
  style?: ViewStyle;
  textStyle?: TextStyle;
  descriptionStyle?: TextStyle;
};

const ALIGNMENT_MAP = {
  start: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    textAlign: 'left',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  end: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    textAlign: 'right',
  },
} as const;

const SectionTitle = ({
  title,
  description,
  align = 'start',
  style,
  textStyle,
  descriptionStyle,
}: SectionTitleProps) => {
  const { theme } = useTheme();

  const alignmentStyles = useMemo(() => {
    const config = ALIGNMENT_MAP[align];

    return {
      container: {
        justifyContent: config.justifyContent,
      } as ViewStyle,
      content: {
        alignItems: config.alignItems,
      } as ViewStyle,
      text: {
        textAlign: config.textAlign,
      } as TextStyle,
    };
  }, [align]);

  return (
    <View style={[styles.container, alignmentStyles.container, style]}>
      <View style={[styles.content, alignmentStyles.content]}>
        <Text
          variant="md"
          style={[styles.title, alignmentStyles.text, textStyle]}
        >
          {title}
        </Text>

        {description && (
          <Text
            variant="sm"
            style={[
              styles.description,
              alignmentStyles.text,
              { color: theme.colors.text.secondary },
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
  },
  description: {
    marginTop: 2,
  },
});

export { SectionTitle };
