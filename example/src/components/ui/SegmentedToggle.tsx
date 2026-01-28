import { useEffect, useMemo, useState } from 'react';
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../providers/ThemeProvider';
import { Text } from './Text';

export type SegmentedOption<T extends string> = {
  label: string;
  value: T;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

type SegmentedToggleProps<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
};

const SegmentedToggle = <T extends string>({
  value,
  options,
  onChange,
}: SegmentedToggleProps<T>) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [containerWidth, setContainerWidth] = useState(0);
  const translateX = useSharedValue(0);

  const activeIndex = useMemo(
    () => options.findIndex((o) => o.value === value),
    [options, value]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  useEffect(() => {
    if (!containerWidth) return;

    const segmentWidth = containerWidth / options.length;

    translateX.value = withTiming(segmentWidth * activeIndex, {
      duration: 200,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex, containerWidth, options.length]);

  const indicatorStyle = useAnimatedStyle(() => {
    const segmentWidth =
      options.length > 0 ? containerWidth / options.length : 0;

    return {
      width: segmentWidth,
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: insets.left + 20,
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.optionsContainer} onLayout={onLayout}>
        <Reanimated.View
          style={[
            styles.indicator,
            {
              backgroundColor: theme.colors.surfaceDisabled,
              borderColor: theme.colors.border,
            },
            indicatorStyle,
          ]}
        />

        {options.map((option) => {
          const selected = option.value === value;

          return (
            <Pressable
              key={option.value}
              style={styles.option}
              onPress={() => onChange(option.value)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={option.accessibilityLabel ?? option.label}
              accessibilityHint={option.accessibilityHint}
            >
              <Text
                variant="sm"
                style={[
                  styles.optionText,
                  {
                    color: selected
                      ? theme.colors.primary
                      : theme.colors.text.secondary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 24,
    borderWidth: 1,
    padding: 2,
    alignSelf: 'stretch',
  },
  optionsContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    left: 0,
    borderRadius: 22,
    borderWidth: 1,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    zIndex: 1,
  },
  optionText: {
    fontWeight: '600',
  },
});

export { SegmentedToggle };
