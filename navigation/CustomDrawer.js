import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import * as firebase from 'firebase';
import * as Linking from 'expo-linking';

import '@firebase/firestore'
export default function CustomDrawer(props) {
    const [name, setname] = useState('');
    const [score, setScore] = useState('');

    DeleteAccount = () => {
        Alert.alert(
            '',
            'Are you sure you want to delete?',
            [
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Yes', onPress: () => {
                        var user = firebase.auth().currentUser;

                        user.delete().then(function () {
                            console.log('Deleted')
                            props.navigation.navigate('Register')
                        }).catch(function (error) {
                            Alert.alert('You need to login again for security reason to delete you account')
                            SignOut();
                            console.log(error)
                        });
                    }
                },
            ],
            { cancelable: false }
        )
    }

    SignOut = () => {
        firebase.auth().signOut()
            .then(() => {
                props.navigation.navigate('Register')
            })
            .catch(error => {

            })
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                var userId = firebase.auth().currentUser.uid
                const db = firebase.firestore();
                db.collection("Users").doc(userId)
                    .onSnapshot(function (doc) {
                        if (doc.data()) {
                            setScore(doc.data().Score)
                            console.log("Current data: ", doc.data());
                        }
                    });
                if (user.email != null) {
                    setname(user.email)
                } else {
                    setname(user.displayName)
                }
            }
        })
    }, []);
    var userId = firebase.auth().currentUser.uid
    let redirectUrl = Linking.makeUrl('', { uid: userId });
    // let redirectUrl = Linking.makeUrl()
    let { path, queryParams } = Linking.parse(redirectUrl);
    return (
        <View style={styles.container}>
            <View style={{ backgroundColor: '#7F171B', height: 200, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{name}</Text>
                {/* <Text style={{ color: '#fff', fontWeight: 'bold' }}>Score: {score}</Text>
                <TouchableOpacity onPress={() => {
                    Clipboard.setString(redirectUrl)
                    Alert.alert('copied')
                }} style={{ marginTop: 20 }}>
                    <Text style={{ textAlign: 'center', color: '#fff' }}>{redirectUrl}</Text>
                </TouchableOpacity> */}
            </View>

            <View style={{ marginHorizontal: 20, flex: 1 }}>
                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => props.navigation.navigate('Home')}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#6D7B8D' }}>Home</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => props.navigation.navigate('LeaderBoard')}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#6D7B8D' }}>Leaderboard</Text>
                </TouchableOpacity> */}

                <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => DeleteAccount()}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#6D7B8D' }}>Delete Account</Text>
                </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={() => SignOut()} style={styles.Row}>
                <Text style={{ fontSize: 16, textAlign: 'center', padding: 10, color: '#fff' }}>Logout</Text>
            </TouchableOpacity>


        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    Title: {
        fontSize: 26,
        fontWeight: 'bold',
        paddingHorizontal: 20
    },
    Row: {
        width: '100%',
        backgroundColor: '#7F171B',

    }


});
