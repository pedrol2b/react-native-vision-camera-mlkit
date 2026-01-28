import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const { theme } = useTheme();

  const isDisabled = disabled || loading;

  const getContainerStyles = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.base, styles[size], { borderRadius: 12 }];

    switch (variant) {
      case 'primary':
        base.push({
          backgroundColor: theme.colors.primary,
        });
        break;

      case 'secondary':
        base.push({
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        });
        break;

      case 'ghost':
        base.push({
          backgroundColor: 'transparent',
        });
        break;
    }

    if (isDisabled) {
      base.push(styles.disabled);
    }

    if (style) {
      base.push(style);
    }

    return base;
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.colors.background;

      case 'secondary':
      case 'ghost':
        return theme.colors.primary;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        ...getContainerStyles(),
        pressed && !isDisabled && { opacity: 0.85 },
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text
          variant={size === 'sm' ? 'sm' : 'md'}
          style={[styles.label, { color: getTextColor() }]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  sm: {
    minHeight: 40,
  },
  md: {
    minHeight: 56,
  },
  lg: {
    minHeight: 64,
  },
  label: {
    textTransform: 'uppercase',
  },
  disabled: {
    opacity: 0.6,
  },
});

export { Button };
