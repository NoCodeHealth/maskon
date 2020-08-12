import Wifi, { WifiEntry } from 'react-native-android-wifi';
import * as RA from 'fp-ts/lib/ReadonlyArray';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { pipe } from 'fp-ts/lib/function';
import * as TD from 'io-ts/lib/TaskDecoder';

export const WifiEntryDecoder: TD.TaskDecoder<unknown, WifiEntry> = TD.type({
  SSID: TD.string,
  BSSID: TD.string,
  capabilities: TD.string,
  frequency: TD.number,
  level: TD.number,
  timestamp: TD.number,
});

export const WifiListDecoder: TD.TaskDecoder<
  unknown,
  Array<WifiEntry>
> = TD.array(WifiEntryDecoder);

const loadNetworks: () => Promise<string> = () =>
  new Promise((resolve, reject) => {
    Wifi.reScanAndLoadWifiList(resolve, reject);
  });

export const scanWifiNetworks = pipe(
  TE.fromTask(loadNetworks),
  TE.map(JSON.parse),
  TE.chainW(WifiListDecoder.decode),
  TE.getOrElse(() => T.of<ReadonlyArray<WifiEntry>>(RA.empty)),
);
