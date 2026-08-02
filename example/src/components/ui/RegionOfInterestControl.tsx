import { useState } from 'react';
import type { RegionOfInterest } from 'react-native-vision-camera-mlkit';
import { SectionSlider } from './SectionSlider';
import { SectionSwitch } from './SectionSwitch';

type NormalizedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type RegionOfInterestControlProps = {
  value: RegionOfInterest | undefined;
  onValueChange: (roi: RegionOfInterest | undefined) => void;
};

const DEFAULT_RECT: NormalizedRect = {
  x: 0.25,
  y: 0.25,
  width: 0.5,
  height: 0.5,
};

const RegionOfInterestControl = ({
  value,
  onValueChange,
}: RegionOfInterestControlProps) => {
  const [rect, setRect] = useState<NormalizedRect>(() => ({
    x: value?.x ?? DEFAULT_RECT.x,
    y: value?.y ?? DEFAULT_RECT.y,
    width: value?.width ?? DEFAULT_RECT.width,
    height: value?.height ?? DEFAULT_RECT.height,
  }));

  const enabled = value !== undefined;

  const updateRect = (patch: Partial<NormalizedRect>) => {
    const next = { ...rect, ...patch };
    const clamped: NormalizedRect = {
      x: Math.min(next.x, 1 - next.width),
      y: Math.min(next.y, 1 - next.height),
      width: next.width,
      height: next.height,
    };

    setRect(clamped);
    if (enabled) {
      onValueChange({ ...clamped, unit: 'normalized' });
    }
  };

  return (
    <>
      <SectionSwitch
        label="Enable Region of Interest"
        description="Crop ML Kit processing to a rectangle of the frame/image to reduce CPU/GPU work."
        value={enabled}
        onValueChange={(next) =>
          onValueChange(next ? { ...rect, unit: 'normalized' } : undefined)
        }
      />
      <SectionSlider
        label="ROI X"
        description="Left edge of the region, normalized 0..1."
        value={rect.x}
        min={0}
        max={1 - rect.width}
        step={0.01}
        disabled={!enabled}
        onValueChange={(x) => updateRect({ x })}
      />
      <SectionSlider
        label="ROI Y"
        description="Top edge of the region, normalized 0..1."
        value={rect.y}
        min={0}
        max={1 - rect.height}
        step={0.01}
        disabled={!enabled}
        onValueChange={(y) => updateRect({ y })}
      />
      <SectionSlider
        label="ROI Width"
        description="Width of the region, normalized 0..1."
        value={rect.width}
        min={0.05}
        max={1 - rect.x}
        step={0.01}
        disabled={!enabled}
        onValueChange={(width) => updateRect({ width })}
      />
      <SectionSlider
        label="ROI Height"
        description="Height of the region, normalized 0..1."
        value={rect.height}
        min={0.05}
        max={1 - rect.y}
        step={0.01}
        disabled={!enabled}
        onValueChange={(height) => updateRect({ height })}
      />
    </>
  );
};

export { RegionOfInterestControl };
