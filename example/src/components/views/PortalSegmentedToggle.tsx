import { useIsFocused } from '@react-navigation/native';
import { useEffect, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePortal } from '../../providers/PortalProvider';
import { SegmentedToggle, type SegmentedOption } from '../ui/SegmentedToggle';

type PortalSegmentedToggleProps<T extends string> = {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
};

const PortalSegmentedToggle = <T extends string>({
  value,
  options,
  onChange,
}: PortalSegmentedToggleProps<T>) => {
  const { mount, unmount } = usePortal();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();

  const portalNode = useMemo(
    () => (
      <View
        pointerEvents="box-none"
        style={[styles.container, { paddingBottom: insets.bottom }]}
      >
        <SegmentedToggle value={value} options={options} onChange={onChange} />
      </View>
    ),
    [value, options, onChange, insets.bottom]
  );

  useEffect(() => {
    if (!isFocused) {
      unmount();
      return;
    }

    mount(portalNode);

    return () => unmount();
  }, [portalNode, mount, unmount, isFocused]);

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export { PortalSegmentedToggle };
