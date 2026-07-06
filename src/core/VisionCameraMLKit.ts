import { NitroModules } from 'react-native-nitro-modules';
import type { VisionCameraMLKit as VisionCameraMLKitSpec } from '../specs/VisionCameraMLKit.nitro';

export const VisionCameraMLKit =
  NitroModules.createHybridObject<VisionCameraMLKitSpec>('VisionCameraMLKit');
