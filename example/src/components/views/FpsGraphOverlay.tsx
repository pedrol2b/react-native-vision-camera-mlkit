import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';

type FpsGraphOverlayProps = {
  fps: number;
  history: number[];
  maxFps: number;
};

const FpsGraphOverlay = ({ fps, history, maxFps }: FpsGraphOverlayProps) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.surface }]}
      accessibilityLabel={`Frame rate: ${fps} frames per second`}
    >
      <Text style={[styles.label, { color: theme.colors.text.primary }]}>
        {fps} FPS
      </Text>
      <View style={styles.bars}>
        {history.map((sample, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height: Math.max(2, (sample / maxFps) * 28),
                backgroundColor: theme.colors.primary,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    left: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    opacity: 0.9,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    gap: 2,
  },
  bar: {
    width: 3,
    borderRadius: 1,
  },
});

export { FpsGraphOverlay };
