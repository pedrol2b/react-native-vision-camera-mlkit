import Slider from '@react-native-community/slider';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

type SectionSliderProps = {
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  onValueChange: (value: number) => void;
};

const SectionSlider = ({
  label,
  description,
  value,
  min = 0.1,
  max = 1,
  step = 0.01,
  disabled = false,
  onValueChange,
}: SectionSliderProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <View style={styles.labelRow}>
          <Text
            variant="sm"
            style={[styles.label, disabled && styles.disabled]}
          >
            {label}
          </Text>
          <Text
            variant="sm"
            style={[
              styles.valueText,
              { color: theme.colors.primary },
              disabled && styles.disabled,
            ]}
          >
            {value.toFixed(2)}
          </Text>
        </View>

        {description && (
          <Text
            variant="xs"
            style={[
              styles.description,
              { color: theme.colors.text.secondary },
              disabled && styles.disabled,
            ]}
          >
            {description}
          </Text>
        )}

        <Slider
          minimumValue={min}
          maximumValue={max}
          step={step}
          value={value}
          disabled={disabled}
          onValueChange={onValueChange}
          minimumTrackTintColor={theme.colors.primary}
          maximumTrackTintColor={theme.colors.border}
          thumbTintColor={theme.colors.primary}
          style={styles.slider}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  itemContent: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  label: {
    marginRight: 12,
  },
  valueText: {
    textTransform: 'uppercase',
  },
  description: {
    marginTop: 2,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 32,
  },
  disabled: {
    opacity: 0.8,
    filter: 'brightness(0.9)',
  },
});

export { SectionSlider };
