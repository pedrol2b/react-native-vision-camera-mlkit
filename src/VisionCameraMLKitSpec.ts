import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  processImage(feature: string, path: string, options: object): Promise<object>;
}

export default TurboModuleRegistry.getEnforcing<Spec>(
  'VisionCameraMLKitModule'
);
