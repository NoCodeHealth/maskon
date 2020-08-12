import { PermissionsAndroid, PermissionStatus } from 'react-native';
import * as T from 'fp-ts/lib/Task';
import { pipe } from 'fp-ts/lib/function';

const checkLocationPermission: T.Task<boolean> = () =>
  PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

const requestLocationPermission: T.Task<PermissionStatus> = () =>
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission is required for WiFi connections',
      message:
        'This app needs location permission as this is required  ' +
        'to scan for wifi networks.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    },
  );

export const requestLocation: T.Task<PermissionStatus> = pipe(
  checkLocationPermission,
  T.chain((granted) =>
    granted
      ? T.of(PermissionsAndroid.RESULTS.GRANTED)
      : requestLocationPermission,
  ),
);
