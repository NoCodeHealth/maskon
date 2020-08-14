declare module 'react-native-android-wifi' {
  export interface WifiEntry {
    SSID: string;
    BSSID: string;
    capabilities: string;
    frequency: number;
    level: number;
    timestamp: number;
  }

  export function reScanAndLoadWifiList(
    cb: (wifiStringList: string) => void,
    err: (error: Error) => void,
  ): void;
}
