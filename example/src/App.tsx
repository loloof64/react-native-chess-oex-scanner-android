import * as React from 'react';

import { StyleSheet, View, Text, ScrollView } from 'react-native';
import Toast from 'react-native-easy-toast';
import ChessOexScannerAndroid from 'react-native-chess-oex-scanner-android';

export default function App() {
  const toast = React.useRef<Toast | null>(null);
  const [enginesStoreList, setEnginesStoreList] = React.useState<Array<string>>(
    []
  );
  const [enginesInstalledList, setEnginesInstalledList] = React.useState<
    Array<string>
  >([]);

  async function getStoreEnginesList() {
    const engines = await ChessOexScannerAndroid.getMyStoreEnginesNames();
    return engines;
  }

  async function getInstalledEnginesList() {
    const engines = await ChessOexScannerAndroid.listInstalledEngines();
    return engines;
  }

  async function installStoreEngine(index: number) {
    try {
      await ChessOexScannerAndroid.installEngineFromMyStore(index);
      toast.current?.show('Engine installed');
    } catch (err) {
      console.error(err);
      toast.current?.show('Failed to install engine !');
    }
  }

  async function playWithEngine(index: number) {
    try {
      const allEngines = await ChessOexScannerAndroid.listInstalledEngines();
      const engineName = allEngines[index];

      console.log('Launching engine ' + engineName);
      await ChessOexScannerAndroid.executeInstalledEngine(index);
    } catch (err) {
      console.error(err);
      toast.current?.show('Failed to launch engine !');
    }
  }

  

  React.useEffect(() => {
    async function setup() {
      await ChessOexScannerAndroid.setupEngineUtils(
        'com.example.reactnativechessoexscannerandroid'
      );
    }

    setup()
      .then(() => {})
      .catch((err) => console.error(err));
    getStoreEnginesList()
      .then((engines) => setEnginesStoreList(engines))
      .catch((err) => {
        console.error(err);
        toast.current?.show('Failed to get engines list from your store !');
      });
    getInstalledEnginesList()
      .then((engines) => setEnginesInstalledList(engines))
      .catch((err) => {
        console.error(err);
        toast.current?.show('Failed to get installed engines list !');
      });

    return function () {
      ChessOexScannerAndroid.stopCurrentRunningEngine();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Toast ref={toast} />
      <View style={styles.storeZone}>
        <Text style={styles.listHeader}>Engines from store</Text>
        <ScrollView>
          {enginesStoreList.map((engineName, index) => {
            return (
              <Text key={engineName} onPress={() => installStoreEngine(index)}  style={styles.listText}>
                {engineName}
              </Text>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.installedZone}>
        <Text style={styles.listHeader}>Engines installed</Text>
        <ScrollView>
          {enginesInstalledList.map((engineName, index) => {
            return (
              <Text key={engineName} onPress={() => playWithEngine(index)} style={styles.listText}>
                {engineName}
              </Text>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeZone: {
    width: '100%',
    height: '50%',
    backgroundColor: 'lightgreen',
  },
  installedZone: {
    width: '100%',
    height: '50%',
    backgroundColor: 'lightyellow',
  },
  listHeader: {
    color: 'blue',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 5,
  },
  listText: {
    marginLeft: 10,
    marginTop: 8,
    marginBottom: 8,
    color: 'magenta',
  }
});
