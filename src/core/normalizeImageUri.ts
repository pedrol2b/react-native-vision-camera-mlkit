import { Platform } from 'react-native';
import { INVALID_URI_ERROR } from '../shared/constants';

/**
 * Validates and normalizes an image URI for the static Nitro APIs.
 */
export const normalizeImageUri = (uri: unknown): string => {
  if (typeof uri !== 'string' || uri.trim().length === 0) {
    throw new Error(INVALID_URI_ERROR);
  }

  if (Platform.OS === 'ios') {
    return uri;
  }

  const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(uri);
  return hasScheme ? uri : `file://${uri}`;
};
