import { NativeModules } from 'react-native';

type ChessOexScannerAndroidType = {
  setupEngineUtils(appId: string): Promise<boolean>;
  getMyStoreEnginesNames(): Promise<Array<string>>;
  installEngineFromMyStore(index: number): Promise<boolean>;
  newVersionAvailableFromMyStoreFor(index: number): Promise<boolean>;
  listInstalledEngines(): Promise<Array<string>>;
  executeInstalledEngine(index: number): Promise<boolean>;
  sendCommandToRunningEngine(command: string): Promise<boolean>;
  readCurrentEnginePendingOutputs(): Promise<Array<string>>;
  stopCurrentRunningEngine(): Promise<boolean>;
};

const { ChessOexScannerAndroid } = NativeModules;

export default ChessOexScannerAndroid as ChessOexScannerAndroidType;
