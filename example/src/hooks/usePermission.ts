import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import {
  check,
  openSettings,
  PERMISSIONS,
  request,
  RESULTS,
  type Permission,
} from 'react-native-permissions';

type UsePermissionReturn = {
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  isLoading: boolean;
};

const resolveCameraPermission = (): Permission =>
  Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

const resolvePhotoPermission = (): Permission =>
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.PHOTO_LIBRARY
    : PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;

const usePermission = (permission: Permission): UsePermissionReturn => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const checkPermission = useCallback(async () => {
    const status = await check(permission);
    const granted = status === RESULTS.GRANTED;
    setHasPermission(granted);
    return granted;
  }, [permission]);

  const requestPermission = useCallback(async () => {
    setIsLoading(true);

    const status = await check(permission);

    if (status === RESULTS.GRANTED) {
      setHasPermission(true);
      setIsLoading(false);
      return true;
    }

    const result = await request(permission);

    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
      setIsLoading(false);
      return true;
    }

    if (result === RESULTS.BLOCKED) {
      openSettings();
    }

    setHasPermission(false);
    setIsLoading(false);
    return false;
  }, [permission]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    hasPermission,
    requestPermission,
    isLoading,
  };
};

export const useCameraPermission = () =>
  usePermission(resolveCameraPermission());

export const usePhotoPermission = () => usePermission(resolvePhotoPermission());
