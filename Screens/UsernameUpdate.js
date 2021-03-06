import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { firebase } from '@firebase/app';
import '@firebase/firestore'


// const recaptchaVerifier = React.useRef(null);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            check: false,
        }
    }



    componentDidMount = async () => {
        let checkAuth = false
        var user = firebase.auth().currentUser.uid;
        const db = firebase.firestore();
        await db.collection("Users").doc(user).get().then(function (doc) {
            let that = this
            if (doc.exists) {
                let username = doc.data().username
                if (username) {
                    checkAuth = true;
                    this.setState({ check: true })
                } else {
                    this.setState({ check: 'false' })
                    console.log("No such document!222");
                }
            } else {
                console.log("No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        if (checkAuth) {
            this.props.navigation.navigate('DrawerNavigation')
        }
    }





    Update = async () => {
        this.setState({ check: false })
        if (this.state.username !== null && this.state.username !== '') {
            console.log('worked')
            const db = firebase.firestore();
            let that = this
            await db.collection("Users").where('username', '==', this.state.username)
                .get()
                .then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());
                        that.setState({ check: true })
                        Alert.alert('Already Taken')
                        return;
                    });
                })
                .catch(function (error) {
                    console.log("Error getting documents: ", error);
                });

            if (!this.state.check) {
                var userId = firebase.auth().currentUser.uid
                const db = firebase.firestore();

                db.collection("Users").doc(userId).set({
                    username: this.state.username
                }, { merge: true }).then((data) => {
                    this.props.navigation.navigate('DrawerNavigation')
                });
            }
        }
    }





    render() {
        if (this.state.check == 'false') {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={styles.modalView}>


                        <Image style={{ height: 150, width: 150, borderRadius: 100 }} source={require('../assets/RUMBLECAPITAL.png')} />

                        <View style={styles.inputView} >
                            <TextInput
                                style={styles.inputText}
                                placeholder="Username"
                                placeholderTextColor="#fff"
                                onChangeText={text => this.setState({ username: text }, () => {
                                    console.log(this.state.username)
                                })} />
                        </View>

                        <TouchableOpacity onPress={() => this.Update()} style={styles.forgotBtn}>
                            <Text style={styles.loginText}>Update</Text>
                        </TouchableOpacity>

                    </View >
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color="#fb5b5a" />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    modalView: {
        width: '85%',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputView: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputText: {
        height: 50,
        color: "white",
        flex: 1
    },
    forgotBtn: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#003f5c',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ButtonContainer: {
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 40
    },
    // inputView: {
    //     width: "80%",
    //     backgroundColor: "#465881",
    //     borderRadius: 25,
    //     height: 50,
    //     marginBottom: 20,
    //     justifyContent: "center",
    //     padding: 20
    // },
    // inputText: {
    //     height: 50,
    //     color: "white"
    // },
    loginBtn: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 5,
    },
    // forgotBtn: {
    //     width: "80%",
    //     backgroundColor: "#fb5b5a",
    //     borderRadius: 25,
    //     height: 50,
    //     alignItems: "center",
    //     justifyContent: "center",
    //     marginBottom: 10,
    // },
    loginBtn2: {
        width: 50,
        height: 50,
        backgroundColor: "#fb5b5a",
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10
    },
    loginText: {
        color: "white"
    },

});
