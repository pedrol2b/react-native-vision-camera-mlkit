import { Platform } from 'react-native';
import VisionCameraMLKitModule from '../VisionCameraMLKitSpec';
import { INVALID_URI_ERROR, MISSING_MODULE_ERROR } from '../shared/constants';
import type { MLKitFeature } from './types';

/**
 * Bridge class for native MLKit image processing
 */
export class NativeBridge {
  /**
   * Process a static image using the specified MLKit feature.
   * @param {MLKitFeature} feature - The MLKit feature to use.
   * @param {string} uri - The file path or URI of the image.
   * @param {object} options - Additional options for processing.
   * @returns {Promise<any>} Promise resolving to the processing result.
   */
  static async processImage(
    feature: MLKitFeature,
    uri: string,
    options: object = {}
  ): Promise<any> {
    if (
      !VisionCameraMLKitModule ||
      typeof VisionCameraMLKitModule.processImage !== 'function'
    ) {
      throw new Error(MISSING_MODULE_ERROR);
    }
    const normalizedUri = this.validateAndNormalizeUri(uri);

    return await VisionCameraMLKitModule.processImage(
      feature,
      normalizedUri,
      options
    );
  }

  /**
   * Validates and normalizes the image URI for different platforms.
   * @param {string} uri - The input URI.
   * @returns {string} The normalized URI.
   * @throws {Error} If the URI is invalid.
   */
  private static validateAndNormalizeUri(uri: string): string {
    if (!uri || typeof uri !== 'string') {
      throw new Error(INVALID_URI_ERROR);
    }

    // Check for basic URI validity
    if (uri.trim().length === 0) {
      throw new Error(INVALID_URI_ERROR);
    }

    // Normalize the URI for different platforms
    let processUri = uri;

    if (Platform.OS === 'ios') {
      // iOS: Remove file:// prefix if present
      processUri = uri.replace('file://', '');
    } else {
      // Android: Ensure proper file:// prefix for absolute file paths without any scheme
      const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(processUri);
      if (!hasScheme) {
        processUri = `file://${processUri}`;
      }
    }

    return processUri;
  }
}
