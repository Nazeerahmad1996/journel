import React, { useState, useEffect } from 'react';
import { Text, View, Button, StyleSheet, TouchableOpacity, Clipboard, Alert, ScrollView, Image } from 'react-native';
import * as firebase from 'firebase';
import * as Linking from 'expo-linking';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import '@firebase/firestore'
export default function CustomDrawer(props) {
    const [name, setname] = useState('');
    const [post, setPost] = useState('');

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
            })
            .catch(error => {

            })
    }

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                if (user.displayName != null) {
                    setname(user.displayName)
                } else {
                    setname(user.email)
                }
            }
        })
        let uid = firebase.auth().currentUser.uid
        var ref = firebase
            .database()
            .ref('Post').orderByChild('User').equalTo(uid);
        ref.once("value")
            .then(function (snapshot) {
                var a = snapshot.numChildren(); // 1 ("name")
                setPost(a)
            });
    }, []);
    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.Header}>
                    {/* <Image
                        source={
                            user.avatar
                                ? { uri: user.avatar }
                                : require('../assets/images/profile.jpg')
                        }
                        style={{ height: 70, width: 70, borderRadius: 50, marginLeft: 5 }}
                    /> */}
                    <Text style={styles.UserName}>{name}</Text>
                    {/* <Text style={styles.email}>Email</Text> */}
                    <View style={styles.Rows}>
                        <View
                            style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                            <Text style={styles.numbers}>{post}</Text>
                            <Text style={styles.email}>Posts</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.body}>
                    <View
                        style={[
                            styles.Middlecontainer,
                            { marginTop: 10, marginBottom: 30, flex: 1 },
                        ]}>
                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('Home')}
                            style={styles.Row}>
                            <View style={styles.IconContainer}>
                                <MaterialCommunityIcons name="pen" size={28} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitleName}>Journal</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('analytics')}
                            style={styles.Row}>
                            <View style={styles.IconContainer}>
                                <MaterialCommunityIcons name="chart-bar" size={28} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitleName}>Analytics</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => props.navigation.navigate('updateUsername')}
                            style={styles.Row}>
                            <View style={styles.IconContainer}>
                                <MaterialCommunityIcons name="pencil" size={28} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitleName}>Update Username</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => DeleteAccount()}
                            style={styles.Row}>
                            <View style={styles.IconContainer}>
                                <MaterialCommunityIcons name="trash-can-outline" size={28} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.rowTitleName}>Delete Account</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{ width: 6, backgroundColor: "#F3534A" }} />
                </View>

                <View style={styles.footer}>

                    <TouchableOpacity onPress={() => SignOut()} style={[styles.Row, { marginVertical: 8 }]}>
                        <View style={styles.IconContainer}>
                            <Ionicons name="md-log-out" size={28} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.rowTitleName}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: 20,
    },

    Header: {
        padding: 20,
        paddingVertical: 40
    },
    numbers: {
        fontWeight: 'bold',
        fontSize: 18,
        marginRight: 10,
    },
    UserName: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 5,
    },
    email: {
        fontSize: 13.5,
        fontWeight: '300',
    },
    Rows: { flexDirection: 'row', marginTop: 10 },
    body: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
    },
    footer: {
        paddingHorizontal: 20,
    },
    Middlecontainer: {
        flex: 1,
        alignItems: 'center',
        marginTop: '10%',
    },
    IconContainer: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#DFE7F5',
        borderRadius: 40,
        marginRight: 15,
    },
    Row: {
        marginVertical: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '88%',
    },
    rowTitleName: {
        fontWeight: 'bold',
        color: '#042C5C',
        fontSize: 18,
    },
});

