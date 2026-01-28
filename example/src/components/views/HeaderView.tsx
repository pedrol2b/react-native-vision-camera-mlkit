import { useNavigation, type NavigationProp } from '@react-navigation/native';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../navigation/RootNavigator';
import { useTerminal } from '../../providers/TerminalProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from '../ui/Text';

type HeaderViewProps = {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  showBackButton?: boolean;
  showThemeButton?: boolean;
};

const HeaderView = ({
  title,
  subtitle,
  align = 'left',
  showBackButton = false,
  showThemeButton = false,
}: HeaderViewProps) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme, isDark, toggleTheme } = useTheme();

  const { isOpen: isTerminalOpen, close: closeTerminal } = useTerminal();

  const handleBackPress = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      isTerminalOpen && closeTerminal();
    }
  }, [navigation, isTerminalOpen, closeTerminal]);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      {showBackButton && (
        <Pressable
          style={styles.backButton}
          onPress={handleBackPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft
            size={28}
            color={theme.colors.icon.primary}
            strokeWidth={2}
          />
        </Pressable>
      )}
      <View style={styles.textContainer}>
        <Text
          variant="xxl"
          style={[styles.title, { textAlign: align }]}
          numberOfLines={1}
          maxFontSizeMultiplier={1.2}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            variant="md"
            style={{ textAlign: align, color: theme.colors.text.secondary }}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {showThemeButton && (
        <Pressable
          style={styles.themeButton}
          onPress={toggleTheme}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <Sun size={24} color={theme.colors.icon.primary} strokeWidth={2} />
          ) : (
            <Moon size={24} color={theme.colors.icon.primary} strokeWidth={2} />
          )}
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  themeButton: {
    marginLeft: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
});

export { HeaderView };
