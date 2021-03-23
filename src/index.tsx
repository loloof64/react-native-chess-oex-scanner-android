import { NativeModules } from 'react-native';

type ChessOexScannerAndroidType = {
  setupEngineUtils(appId: string): Promise<void>;
  getMyStoreEnginesNames(): Promise<Array<string>>;
  installEngineFromMyStore(index: number): Promise<void>;
  newVersionAvailableFromMyStoreFor(index: number): Promise<boolean>;
  listInstalledEngines(): Promise<Array<string>>;
  executeInstalledEngine(index: number): Promise<void>;
  sendCommandToRunningEngine(command: string): Promise<void>;
  readCurrentEnginePendingOutputs(): Promise<Array<string>>;
  stopCurrentRunningEngine(): Promise<void>;
};

const { ChessOexScannerAndroid } = NativeModules;

export default ChessOexScannerAndroid as ChessOexScannerAndroidType;
