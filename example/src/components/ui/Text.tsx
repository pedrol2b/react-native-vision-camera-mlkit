import type { ComponentProps } from 'react';
import { Text as RNText } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { typography } from '../../styles/themes';

type Variant = keyof typeof typography;

type TextProps = ComponentProps<typeof RNText> & {
  variant?: Variant;
};

const Text = ({ variant = 'sm', style, ...props }: TextProps) => {
  const { theme } = useTheme();

  return (
    <RNText
      style={[
        { ...typography[variant], color: theme.colors.text.primary },
        style,
      ]}
      {...props}
    />
  );
};

export { Text };
