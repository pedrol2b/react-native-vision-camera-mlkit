import { StyleSheet, Switch, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

type SectionSwitchProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

const SectionSwitch = ({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: SectionSwitchProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.item}>
      <View style={styles.itemContent}>
        <Text variant="sm" style={[styles.label, disabled && styles.disabled]}>
          {label}
        </Text>
        {description && (
          <Text
            variant="xs"
            style={[
              styles.itemDescription,
              { color: theme.colors.text.secondary },
              disabled && styles.disabled,
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{
          false: theme.colors.switch.track.inactive,
          true: theme.colors.switch.track.active,
        }}
        thumbColor={
          value
            ? theme.colors.switch.thumb.active
            : theme.colors.switch.thumb.inactive
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 56,
  },
  itemContent: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    marginBottom: 2,
  },
  itemDescription: {
    marginTop: 2,
  },
  disabled: {
    opacity: 0.6,
  },
});

export { SectionSwitch };
