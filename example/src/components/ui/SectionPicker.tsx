import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

type SectionPickerOption<T> = {
  label: string;
  value: T;
};

type SectionPickerProps<T> =
  | {
      label: string;
      description?: string;
      value: T;
      options: SectionPickerOption<T>[];
      onValueChange: (value: T) => void;
      disabled?: boolean;
      multiple?: false;
    }
  | {
      label: string;
      description?: string;
      value: T[];
      options: SectionPickerOption<T>[];
      onValueChange: (value: T[]) => void;
      disabled?: boolean;
      multiple: true;
    };

const SectionPicker = <T extends string>(props: SectionPickerProps<T>) => {
  const { label, description, options, disabled = false } = props;
  const isMultiple = props.multiple === true;
  const { theme } = useTheme();
  const [isPickerVisible, setPickerVisible] = useState<boolean>(false);

  const selectedValues = Array.isArray(props.value)
    ? props.value
    : [props.value];
  const selectedOptions = options.filter((opt) =>
    selectedValues.includes(opt.value)
  );

  const selectedLabel = (() => {
    if (isMultiple) {
      if (selectedOptions.length === 0) return 'Select';
      if (selectedOptions.length <= 2) {
        return selectedOptions.map((opt) => opt.label).join(', ');
      }
      return `${selectedOptions.length} selected`;
    }
    return selectedOptions[0]?.label;
  })();

  const handleSelect = (selectedValue: T) => {
    if (isMultiple) {
      const currentValues = Array.isArray(props.value) ? props.value : [];
      const isSelected = currentValues.includes(selectedValue);
      const nextValues = isSelected
        ? currentValues.filter((item) => item !== selectedValue)
        : [...currentValues, selectedValue];
      props.onValueChange(nextValues);
      return;
    }
    props.onValueChange(selectedValue as T);
    setPickerVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.item}
        onPress={() => !disabled && setPickerVisible(true)}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <View style={styles.itemContent}>
          <Text
            variant="sm"
            style={[styles.label, disabled && styles.disabled]}
          >
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
        <View
          style={[
            styles.valueContainer,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            },
          ]}
        >
          <Text
            variant="sm"
            style={[styles.valueText, { color: theme.colors.primary }]}
          >
            {selectedLabel}
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isPickerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  styles.pickerContainer,
                  {
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.pickerHeader,
                    { borderBottomColor: theme.colors.border },
                  ]}
                >
                  <Text variant="md">{label}</Text>
                  <TouchableOpacity
                    onPress={() => setPickerVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text
                      variant="sm"
                      style={[{ color: theme.colors.primary }]}
                    >
                      Done
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={styles.optionsList} removeClippedSubviews>
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option.value);
                    return (
                      <Pressable
                        key={option.value}
                        style={({ pressed }) => [
                          styles.optionItem,
                          {
                            backgroundColor: pressed
                              ? theme.colors.surface
                              : 'transparent',
                            borderLeftWidth: isSelected ? 3 : 0,
                            borderLeftColor: theme.colors.primary,
                          },
                        ]}
                        onPress={() => handleSelect(option.value)}
                      >
                        <Text
                          variant="md"
                          style={[
                            styles.optionLabel,
                            {
                              color: isSelected
                                ? theme.colors.primary
                                : theme.colors.text.primary,
                            },
                          ]}
                        >
                          {option.label}
                        </Text>
                        {isSelected && (
                          <Text
                            variant="lg"
                            style={{ color: theme.colors.primary }}
                          >
                            ✓
                          </Text>
                        )}
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
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
  valueContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: 70,
    alignItems: 'center',
  },
  valueText: {
    textTransform: 'uppercase',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pickerContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionLabel: {
    flex: 1,
  },
});

export { SectionPicker };
