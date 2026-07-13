import { StyleSheet, View } from 'react-native';
import type { RegionOfInterest } from 'react-native-vision-camera-mlkit';
import { useTheme } from '../../providers/ThemeProvider';

type ROIOverlayProps = {
  roi: RegionOfInterest;
};

const ROIOverlay = ({ roi }: ROIOverlayProps) => {
  const { theme } = useTheme();

  if (roi.unit === 'pixel') return null;

  return (
    <View
      pointerEvents="none"
      accessibilityLabel="Region of interest boundary"
      style={[
        styles.rect,
        {
          left: `${roi.x * 100}%`,
          top: `${roi.y * 100}%`,
          width: `${roi.width * 100}%`,
          height: `${roi.height * 100}%`,
          borderColor: theme.colors.primary,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  rect: {
    position: 'absolute',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 4,
  },
});

export { ROIOverlay };
