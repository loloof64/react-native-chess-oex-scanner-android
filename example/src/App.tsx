import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import ChessOexScannerAndroid from 'react-native-chess-oex-scanner-android';

export default function App() {
  const [enginesStoreList, setEnginesStoreList] = React.useState<Array<string>>([]);

  React.useEffect(() => {
    async function setup() {
      try {
        await ChessOexScannerAndroid.setupEngineUtils("com.example.reactnativechessoexscannerandroid");
      }
      catch (err) {
        throw err;
      }
    }

    async function getStoreEnginesList() {
      try {
        const engines = await ChessOexScannerAndroid.getMyStoreEnginesNames();
        return engines;
      }
      catch (err) {
        throw err;
      }
    }

    
    setup().then(() => {}).catch((err) => console.error(err));
    getStoreEnginesList().then((engines) => setEnginesStoreList(engines)).catch((err) => console.error(err));
    

    return function() {
      ChessOexScannerAndroid.stopCurrentRunningEngine();
    }
  }, []);

  return (
    <View style={styles.container}>
      {
        enginesStoreList.map((engineName) => {
          return (
            <Text key={engineName}>
              {engineName}
            </Text>
          )
        })
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
