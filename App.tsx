import React, {useState} from 'react';
import {Button, ScrollView, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

function App(): React.JSX.Element {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCodes, setScannedCodes] = useState<Array<Code>>([]);
  const isNotScanning = !isScanning;
  const device = useCameraDevice('back');
  const {hasPermission, requestPermission} = useCameraPermission();

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes: Code[]) => {
      setScannedCodes([...scannedCodes, ...codes]);
      console.log(JSON.stringify(codes, null, 2));
      setIsScanning(false);
    },
  });

  if (!hasPermission) requestPermission();

  if (!hasPermission)
    return (
      <View>
        <Text>No Camera Permission</Text>
      </View>
    );
  if (device == null)
    return (
      <View>
        <Text>No Device available</Text>
      </View>
    );
  return (
    <>
      {isNotScanning && (
        <ScrollView style={styles.container}>
          <Button title="Start Scanning" onPress={() => setIsScanning(true)} />
          <Text style={{marginVertical: 10}}>SCANNED CODES</Text>
          {scannedCodes.map((code: Code, index) => (
            <View key={index}>
              <Text style={{marginTop: 30}}># {index}</Text>
              <Text>Barcode type: {code.type}</Text>
              <Text>Barcode value: {code.value}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {isScanning && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
