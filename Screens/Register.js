import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Image, ImageBackground, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import * as firebase from 'firebase';
import '@firebase/firestore'
import * as Linking from 'expo-linking';
import * as Constants from 'expo-constants';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as Facebook from 'expo-facebook';
import * as Google from "expo-google-app-auth";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native-gesture-handler';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const IOS_CLIENT_ID =
    "857474040308-a4hqd3abovaq7ti54db05lh4onmn9nki.apps.googleusercontent.com";
const ANDROID_CLIENT_ID =
    "857474040308-33n9vktheee6ggpua9c8abnl8koleipj.apps.googleusercontent.com";

const Stand_Alone_Build = "857474040308-5p19fk7fj87r21ab3vhb0cnkackls1dt.apps.googleusercontent.com";
const Stand_Alone_Build_IOS = "533567482896-5ca12bj339sdkesjlg501bmkdrs68oii.apps.googleusercontent.com";
const webClientId = "857474040308-7u9227cl0vqdjqmir3pnndmho9eabnvb.apps.googleusercontent.com"
// const recaptchaVerifier = React.useRef(null);

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            logged: false,
            name: '',
            SignUpPage: false,
            forgetPassword: false,
            ScoreUid: null,
            check: true,
            help: false,
            modalPages: false,
        }
    }


    handleOpenURL(url) {
        console.log('worked', url)
        let { path, queryParams } = Linking.parse(url);
        console.log(queryParams.uid)
        this.setState({ ScoreUid: queryParams.uid })
    }


    async componentDidMount() {

        Linking.addEventListener('url', ({ url }) => this.handleOpenURL(url))

        console.log('===========' + this.state.ScoreUid)
        firebase.auth().onAuthStateChanged((user) => {
            if (user && this.state.check) {
                this.props.navigation.navigate('DrawerNavigation')
            }
            this.setState({ check: false })
        });
    }





    GooglelogIn = async () => {
        try {
            const result = await Google.logInAsync({
                iosClientId: IOS_CLIENT_ID,
                androidClientId: ANDROID_CLIENT_ID,
                androidStandaloneAppClientId: Stand_Alone_Build,
                iosStandaloneAppClientId: Stand_Alone_Build_IOS,
                webClientId: webClientId,
                scopes: ["profile", "email"]
            });
            console.log(result.user)

            if (result.type === "success") {
                const credential = firebase.auth.GoogleAuthProvider.credential(result.idToken, result.accessToken);
                firebase
                    .auth()
                    .signInAndRetrieveDataWithCredential(credential)
                    .then(res => {
                        const db = firebase.firestore();
                        if (this.state.ScoreUid) {
                            let score = 0
                            let that = this;
                            db.collection("Users").doc(this.state.ScoreUid).get().then(function (doc) {
                                if (doc.exists) {
                                    console.log('worl: ', doc.data().Score)
                                    db.collection("Users").doc(that.state.ScoreUid).update({
                                        Score: doc.data().Score + 10
                                    })
                                } else {
                                    console.log("No such document!");
                                }
                            }).catch(function (error) {
                                console.log("Error getting document:", error);
                            });
                        }
                        var userId = firebase.auth().currentUser.uid
                        db.collection("Users").doc(userId).get().then(function (doc) {
                            if (doc.exists) {

                            } else {
                                db.collection("Users").doc(userId).set(result.user).then((data) => {
                                    db.collection("Users").doc(userId).update({
                                        Score: 0
                                    })
                                });
                            }
                        }).catch(function (error) {
                            console.log("Error getting document:", error);
                        });
                        this.props.navigation.navigate("UsernameUpdate")
                        console.log("Successful");
                    })
                    .catch(error => {
                        console.log("firebase cred err:", error);
                    });
                console.log("LoginScreen.js.js 21 | ", result.user.givenName);
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            console.log('LoginScreen.js.js 30 | Error with login', e);
            return { error: true };
        }
    };


    ForgotPassword = () => {
        firebase.auth().sendPasswordResetEmail(this.state.email)
            .then(function (user) {
                alert('Please check your email...')
            }).catch(function (e) {
                alert(e)
            })
    }

    SignOut = () => {
        firebase.auth().signOut()
            .then(() => {
                this.props.navigation.navigate('Register')
            })
            .catch(error => {

            })
    }

    renderModalHelp = () => (
        <View style={styles.modalView}>



            <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 25 }}>Help</Text>

            {this.state.modalPages ? (
                <Text style={{ marginHorizontal: 20, fontWeight: 'bold', textAlign: 'center' }}>You will choose a username to protect anonymite. You are awarded points each time you successfully invite a new user or post a reason to the Dump Trump reason board. To begin, login.</Text>

            ) : (
                    <Text style={{ marginHorizontal: 20, fontWeight: 'bold', textAlign: 'center' }}>DUMPTRUMP APP is a social game app desinged to secure votes needed to beat Donald Trump in the upcoming fall elctions.</Text>

                )
            }

            <TouchableOpacity style={{ marginTop: 10 }} onPress={() => this.setState({ modalPages: !this.state.modalPages })}>
                <MaterialCommunityIcons name={this.state.modalPages ? "arrow-left-thick" : "arrow-right-thick"} size={40} />
            </TouchableOpacity>

            <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 10 }} onPress={() => this.setState({ help: false })}>
                <MaterialCommunityIcons name="close-circle" size={25} />
            </TouchableOpacity>

        </View >
    );

    renderModalContent = () => (
        <View style={styles.modalView}>

            <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 25 }}>Forgot Password</Text>

            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="Email..."
                    placeholderTextColor="#003f5c"
                    onChangeText={text => this.setState({ email: text })} />
            </View>

            <TouchableOpacity onPress={() => this.ForgotPassword()} style={styles.forgotBtn}>
                <Text style={styles.loginText}>Forgot</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.setState({ forgetPassword: false })}>
                <Text style={{ fontSize: 17, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>

        </View>
    );

    async openUrl(url) {
        try {
            const can = await Linking.canOpenURL(url);
            if (can) {
                Linking.openURL(url);
                return;
            } else {
                console.log('cant')
            }
        }
        catch (e) {
            console.log(e)
        }
        Alert.alert(I18n.t('unknown_error'));
    }


    render() {
        return (
            <View style={styles.container}>

                <Image style={{ height: 150, width: 150, borderRadius: 100 }} source={require('../assets/icon.png')} />

                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20 }}>
                        <Text style={{ fontFamily: 'PermanentMarker', color: '#7F171B', fontSize: 40, textAlign: 'center', marginHorizontal: 10 }}>Journal</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.GooglelogIn()} style={styles.loginBtn2}>
                        <MaterialCommunityIcons name="google-plus" size={32} color='#fff' />
                        <Text style={styles.loginText}>Google</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10
    },
    ButtonContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderRadius: 4,
        paddingVertical: 30,
        borderColor: 'grey'
    },
    logo: {
        fontWeight: "bold",
        fontSize: 50,
        color: "#fb5b5a",
        marginBottom: 40
    },
    inputView: {
        width: "80%",
        backgroundColor: "#465881",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20
    },
    inputText: {
        height: 50,
        color: "white"
    },
    forgot: {
        color: "white",
        fontSize: 11
    },
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
    Helpbtn: {
        alignSelf: 'center'
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
    loginBtn2: {
        backgroundColor: "#7F171B",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: 'row',
        padding: 5,
        marginTop: 10
    },
    loginText: {
        color: "white",
        marginLeft: 10,
        fontSize: 18
    },
    modalView: {
        width: '95%',
        borderRadius: 10,
        alignSelf: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
});
