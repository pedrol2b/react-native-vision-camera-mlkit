import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

type SectionProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

const Section = ({ title, description, children }: SectionProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.section}>
      <Text
        variant="md"
        style={[styles.title, { color: theme.colors.text.secondary }]}
      >
        {title}
      </Text>
      {description && (
        <Text
          variant="sm"
          style={[styles.description, { color: theme.colors.text.secondary }]}
        >
          {description}
        </Text>
      )}
      <View
        style={[
          styles.content,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  title: {
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  description: {
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  content: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
});

export { Section };
