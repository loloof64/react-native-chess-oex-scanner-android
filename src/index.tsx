import { NativeModules } from 'react-native';

type ChessOexScannerAndroidType = {
  multiply(a: number, b: number): Promise<number>;
};

const { ChessOexScannerAndroid } = NativeModules;

export default ChessOexScannerAndroid as ChessOexScannerAndroidType;
