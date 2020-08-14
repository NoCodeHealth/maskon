import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import PushNotification from 'react-native-push-notification';

import { WifiPoller } from './src/components/WifiPoller';
import { requestLocation } from './src/services/location';

PushNotification.configure({
  onRegister: (token) => {
    console.log('TOKEN:', token);
  },
  onNotification: (notification) => {
    console.log('NOTIFICATION:', notification);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

declare const global: { HermesInternal: null | {} };

const App = () => {
  const [permissions, setPermissions] = React.useState(
    PermissionsAndroid.RESULTS.DENIED,
  );

  React.useEffect(() => {
    const requestLocationPermissions = async () => {
      setPermissions(await requestLocation());
    };
    requestLocationPermissions();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Welcome to MASK ON</Text>
          </View>
          {global.HermesInternal == null ? null : (
            <View style={styles.engine}>
              <Text style={styles.footer}>Engine: Hermes</Text>
            </View>
          )}
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              {permissions === PermissionsAndroid.RESULTS.GRANTED ? (
                <WifiPoller />
              ) : (
                <View>
                  <Text style={styles.sectionTitle}>Error</Text>
                  <Text style={styles.sectionDescription}>
                    We can't let you know when to don your mask if we do not
                    have your location. Enable Location permissions in your
                    settings.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 32,
    width: '100%',
    marginVertical: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
