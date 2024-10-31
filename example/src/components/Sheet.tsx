import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetView,
  BottomSheetVirtualizedList,
  useBottomSheetSpringConfigs,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from '@gorhom/bottom-sheet';
import { type BottomSheetModalMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React, {
  forwardRef,
  useMemo,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { StyleSheet } from 'react-native';
import { type ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SpringConfig = {
  stiffness?: number;
  overshootClamping?: boolean;
  restDisplacementThreshold?: number;
  restSpeedThreshold?: number;
  velocity?: number;
  reduceMotion?: ReduceMotion;
} & (
  | {
      mass?: number;
      damping?: number;
      duration?: never;
      dampingRatio?: never;
    }
  | {
      mass?: never;
      damping?: never;
      duration?: number;
      dampingRatio?: number;
    }
);

const animationConfig: Omit<SpringConfig, 'velocity'> = {
  damping: 80,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};

const snapPoints = ['25%', '50%', '100%'];

type BackdropPressBehavior = 'none' | 'close' | 'collapse' | number;

interface BackdropProps extends BottomSheetBackdropProps {
  opacity?: number;
  appearsOnIndex?: number;
  disappearsOnIndex?: number;
  enableTouchThrough?: boolean;
  pressBehavior?: BackdropPressBehavior;
  onPress?: () => void;
  children?: ReactNode | ReactNode[];
}

const Backdrop = ({ ...props }: BackdropProps) => {
  return (
    <BottomSheetBackdrop disappearsOnIndex={-1} appearsOnIndex={0} {...props} />
  );
};

interface SheetProps extends BottomSheetModalProps {
  children: ReactNode;
  dismissable?: boolean;
}

interface SheetType
  extends React.ForwardRefExoticComponent<
    SheetProps & RefAttributes<BottomSheetModalMethods>
  > {
  View: typeof BottomSheetView;
  ScrollView: typeof BottomSheetScrollView;
  FlatList: typeof BottomSheetFlatList;
  SectionList: typeof BottomSheetSectionList;
  VirtualizedList: typeof BottomSheetVirtualizedList;
}

const Sheet = forwardRef<BottomSheetModalMethods, SheetProps>(
  ({ children, dismissable = true, ...props }: SheetProps, ref) => {
    const { top: topInset } = useSafeAreaInsets();

    const backdropPressBehavior = useMemo(
      () => (dismissable ? 'close' : 'none'),
      [dismissable]
    );

    const animationConfigs = useBottomSheetSpringConfigs(animationConfig);

    return (
      <BottomSheetModal
        ref={ref}
        index={1}
        snapPoints={snapPoints}
        animationConfigs={animationConfigs}
        topInset={topInset}
        // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-shadow
        backdropComponent={(props) => (
          <Backdrop pressBehavior={backdropPressBehavior} {...props} />
        )}
        enableDismissOnClose={dismissable}
        enableOverDrag={false}
        enablePanDownToClose={dismissable}
        stackBehavior="replace"
        containerStyle={styles.container}
        handleIndicatorStyle={styles.handleIndicator}
        backgroundStyle={styles.background}
        {...props}
      >
        {children}
      </BottomSheetModal>
    );
  }
) as SheetType;

const styles = StyleSheet.create({
  container: {
    zIndex: 20, // Ensure the Sheet is on top of all other components
  },
  handleIndicator: {
    width: 100,
    height: 8,
  },
  background: {
    borderRadius: 0,
  },
});

Sheet.View = BottomSheetView;
Sheet.ScrollView = BottomSheetScrollView;
Sheet.FlatList = BottomSheetFlatList;
Sheet.SectionList = BottomSheetSectionList;
Sheet.VirtualizedList = BottomSheetVirtualizedList;

export { Sheet };
