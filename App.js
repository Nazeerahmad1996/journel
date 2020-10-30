import React from 'react';
import { StyleSheet, SafeAreaView, Text } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore'
import StackNavigator from './navigation/Stack'
import * as Font from 'expo-font';
// import * as Notifications from 'expo-notifications';
var config = {
  apiKey: "AIzaSyDsGTBoroTtTuH7OQoV8e_ZPtpCYrmhqR4",
  authDomain: "tuition-ac131.firebaseapp.com",
  databaseURL: "https://tuition-ac131.firebaseio.com",
  projectId: "tuition-ac131",
  storageBucket: "tuition-ac131.appspot.com",
  messagingSenderId: "857474040308",
  appId: "1:857474040308:web:ac2424f978362502"
};
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}


export default class App extends React.Component {

  state = {
    fontLoaded: false,
  }

  async scheduleAndCancel() {

    console.log('Worked');
    let userName = ''
    var user = firebase.auth().currentUser.uid;
    var docRef = firebase.firestore().collection("Users").doc(user);

    await docRef.get().then(function (doc) {
      if (doc.exists) {
        userName = doc.data().username
        console.log("Document data:", doc.data().username);
      }
    }).catch(function (error) {
      console.log("Error getting document:", error);
    });

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hi " + userName,
        body: "it's time to journal? How are you today?",
      },
      trigger: {
        hour: 21,
        minute: 0,
        repeats: true
      },
    });
    // await Notifications.cancelScheduledNotificationAsync(identifier);
  }



  async componentDidMount() {
    this.scheduleAndCancel()
    await Font.loadAsync({
      PermanentMarker: require('./assets/PermanentMarker.ttf'),
    });

    this.setState({ fontLoaded: true })
  }
  render() {

    return (
      <SafeAreaView style={styles.container}>
        {this.state.fontLoaded ? (
          <StackNavigator />
        ) : (
            <Text>Font not Loaded</Text>
          )}

      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

});
