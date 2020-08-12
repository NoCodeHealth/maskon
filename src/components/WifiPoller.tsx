import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import PushNotification from 'react-native-push-notification';
import { from, interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import {
  bufferTime,
  catchError,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs/operators';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import { pipe } from 'fp-ts/lib/function';

import { scanWifiNetworks } from '../services/wifi';

interface WifiPollerProps {}

export const WifiPoller: React.FC<WifiPollerProps> = () => {
  const [indoors, setIndoors] = React.useState<boolean>(false);

  React.useEffect(() => {
    const subscription = pipe(
      interval(1),
      switchMap(() => from(scanWifiNetworks())),
      bufferTime(5000, 30000, 120),
      switchMap((entries) =>
        ajax({
          url:
            'http://ec2-18-219-8-226.us-east-2.compute.amazonaws.com:5000/data_in',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            key:
              'b4e018b4adb10c82c3b67e1dce2f3e52aac5eacc038d8fd38b8104b3a7d94115',
          },
          body: {
            user_id: 0,
            received_array: pipe(
              entries,
              RA.flatten,
              RA.map((entry) => ({
                TS: entry.timestamp,
                BSSID: entry.BSSID,
                Level: entry.level,
              })),
            ),
          },
        }).pipe(
          map((response) =>
            JSON.parse(response.response.predicted_indoor_state.toLowerCase()),
          ),
          catchError((err) => {
            console.log('error', err);
            return of(false);
          }),
        ),
      ),
      distinctUntilChanged(),
    ).subscribe((isIndoors) => {
      setIndoors(isIndoors);

      if (isIndoors) {
        PushNotification.localNotification({
          title: 'Mask On',
          message: 'Indoor travel detected - don your mask!',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <View>
      <Text style={styles.sectionDescription}>
        Is Indoors: {JSON.stringify(indoors, null, 2)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
});

WifiPoller.displayName = 'WifiScanner';
