import * as React from 'react';

import { StyleSheet, View, Text, ScrollView, Button } from 'react-native';
import Toast from 'react-native-easy-toast';
import Dialog from 'react-native-dialog';
import ChessOexScannerAndroid from 'react-native-chess-oex-scanner-android';

export default function App() {
  const toast = React.useRef<Toast | null>(null);
  const [commandValue, setCommandValue] = React.useState('');
  const [commandDialogVisible, setCommandDialogVisible] = React.useState(false);
  const [enginesStoreList, setEnginesStoreList] = React.useState<Array<string>>(
    []
  );
  const [enginesInstalledList, setEnginesInstalledList] = React.useState<
    Array<string>
  >([]);

  function askForCommand(_e: any) {
    setCommandDialogVisible(true);
  }

  async function readOutputsFromEngine() {
    try {
      const lines = await ChessOexScannerAndroid.readCurrentEnginePendingOutputs();
      if (lines.length > 0) {
        lines.forEach((singleLine) => console.log(singleLine));
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancelCommandDialog() {
    setCommandDialogVisible(false);
  }

  async function sendCommandToEngine() {
    setCommandDialogVisible(false);
    try {
      const command = commandValue;
      await ChessOexScannerAndroid.sendCommandToRunningEngine(command);
    } catch (err) {
      console.error(err);
    }
  }

  async function getStoreEnginesList() {
    const engines = await ChessOexScannerAndroid.getMyStoreEnginesNames();
    return engines;
  }

  async function getInstalledEnginesList() {
    function stripNameFromLibName(libName: string) {
      let result = libName;
      result = result.substring(3);
      result = result.substring(0, result.length - 3);
      return result;
    }

    const engines = await ChessOexScannerAndroid.listInstalledEngines();
    return engines.map((item) => stripNameFromLibName(item));
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

  React.useEffect(() => {
    let timer = setInterval(readOutputsFromEngine, 1000);
    return function () {
      clearInterval(timer);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Toast ref={toast} />
      <Dialog.Container visible={commandDialogVisible}>
        <Dialog.Title>Send command</Dialog.Title>
        <Dialog.Input
          label="Command:"
          value={commandValue}
          onChangeText={setCommandValue}
        />
        <Dialog.Button label="Cancel" onPress={handleCancelCommandDialog} />
        <Dialog.Button label="Send" onPress={sendCommandToEngine} />
      </Dialog.Container>
      <Button onPress={askForCommand} title="Send command" />
      <View style={styles.storeZone}>
        <Text style={styles.listHeader}>Engines from store</Text>
        <ScrollView>
          {enginesStoreList.map((engineName, index) => {
            return (
              <Text
                key={engineName}
                onPress={() => installStoreEngine(index)}
                style={styles.listText}
              >
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
              <Text
                key={engineName}
                onPress={() => playWithEngine(index)}
                style={styles.listText}
              >
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
    height: '40%',
    backgroundColor: 'lightgreen',
    marginTop: 10,
  },
  installedZone: {
    width: '100%',
    height: '40%',
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
  },
});
