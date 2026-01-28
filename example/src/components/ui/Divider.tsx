import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

type DividerProps = ViewProps;

const Divider = ({ style, ...props }: DividerProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View
        {...props}
        style={[
          styles.divider,
          { backgroundColor: theme.colors.border },
          style,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  divider: {
    width: '100%',
    height: StyleSheet.hairlineWidth,
  },
});

export { Divider };
