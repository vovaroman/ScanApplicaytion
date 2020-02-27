import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View, Alert } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as WebBrowser from 'expo-web-browser';
import Constants from "expo-constants";
const { manifest } = Constants;

import { MonoText } from '../components/StyledText';

async function _onPressButton() {
  try {
    var data = 4
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
}


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <TouchableHighlight style={styles.button} onPress={async () => await _onPressButton()} underlayColor="white">
            <View style={styles.buttonText}>
              <Text>Register new product</Text>
            </View>
          </TouchableHighlight>
      </ScrollView>

      
    </View>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use useful development
        tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/workflow/development-mode/');
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/get-started/create-a-new-app/#making-your-first-change'
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  button: {
    marginBottom: 30,
    width: 260,
    alignItems: 'center',
    backgroundColor: '#2196F3'
  },
  buttonText: {
    textAlign: 'center',
    padding: 20,
    color: 'white'
  },
  viewPadding: {
    paddingTop: 10,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    top:100,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
