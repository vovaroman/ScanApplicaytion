import { StyleSheet, Text, View,Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useState, useEffect } from 'react';
import Constants from "expo-constants";
const { manifest } = Constants;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
      try{
      setScanned(true);
      try {
        const uri = `http://${manifest.debuggerHost.split(':').shift()}:888`;
    
        let response = await fetch(`${uri}/Product/${data}/`);
        let responseJson = await response.json();
        Alert.alert(
          'Продать предмет?',
          `Название: ${responseJson.name}\nКоличество: ${responseJson.quantity}`,
          [
            {
              text: 'Отмена',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            { text: 'Добавить товар', onPress: async () => {
              let response = await fetch(`${uri}/Product/${data}/`, {
                method: 'PUT',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  ID: 1,
                  Name: responseJson.name,
                  Quantity:responseJson.quantity
                }),
              }).then(response => response.json()).then(responsejs => {
    
                if(responsejs.statusCode == 200){
                  Alert.alert('Операция выполнена успешно',`Товар ${responseJson.name} успешно добавлен, текущее кол-во -> ${++responseJson.quantity}`)
                }
                else{
                  Alert.alert('Ошибка', `Товар ${responseJson.name} кончился.`)
                }
              });
            }},
            {
              text: 'Продать товар', onPress: async () => {
                let response = await fetch(`${uri}/Product/${data}/`, {
                  method: 'PUT',
                  headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ID: 0,
                    Name: responseJson.name,
                    Quantity:responseJson.quantity
                  }),
                }).then(response => response.json()).then(responsejs => {
      
                  if(responsejs.statusCode == 200){
                    Alert.alert('Операция выполнена успешно',`Товар ${responseJson.name} успешно продан, текущее кол-во -> ${--responseJson.quantity}`)
                  }
                  else{
                    Alert.alert('Ошибка', `Товар ${responseJson.name} кончился.`)
                  }
                });
            }}
            ,
          ],
          { cancelable: false }
        );
      } catch (error) {
        console.error(error);
      }
    }catch(error){setScanned(false);}
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
});
