import * as React from 'react';
import { Alert, TextInput, Dimensions, StyleSheet, Text, TouchableOpacity, Share, View, BackHandler, FlatList, StatusBar, Image, LogBox } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import Modal from 'react-native-modal';

import * as firebase from 'firebase';
import * as Notifications from 'expo-notifications';
import '@firebase/firestore'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Timer from './timer';
import * as ImagePicker from 'expo-image-picker';
import StarRating from 'react-native-star-rating';
import CheckBox from '@react-native-community/checkbox';
import { Audio } from 'expo-av';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications
let uri = null;
export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: false,
            name: '',
            Post: false,
            Description: '',
            messages: [],
            postQuota: false,
            starCount: 3.5,
            Image: '',
            specialPost: false,
            recording: undefined,
            counter: 0
        }

        this.myInterval = null;
    }
    onShare = async () => {
        try {
            const result = await Share.share({
                message:
                    'React Native | A framework for building native apps using React',
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.3,
        });

        const myRef = firebase.database().ref();
        const Key = myRef.push();
        if (!result.cancelled) {
            this.setState({ ImageLoading: true })
        }
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", result.uri, true);
            xhr.send(null);
        });


        const reference = firebase.storage().ref().child('images/' + Key);

        const snapshot = await reference.put(blob);
        const myUrl = await snapshot.ref.getDownloadURL();
        if (myUrl != null || myUrl != '') {
            this.setState({ ImageLoaded: true })
        }
        this.setState({ Image: myUrl })


    };

    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    startRecording = async () => {
        try {
            let _this = this
            console.log('Requesting permissions..');
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            console.log('Starting recording..');
            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            uri = recording;
            this.setState({ recording });
            this.myInterval = setInterval(function () {
                _this.setState({ counter: _this.state.counter + 1 })
            }, 1000);
            console.log('Recording started');
        } catch (err) {
            console.error('Failed to start recording', err);
        }
    }

    stopRecording = async () => {
        console.log('Stopping recording..');
        clearInterval(this.myInterval)
        await uri.stopAndUnloadAsync();
        const uri1 = uri.getURI();
        this.setState({ recording: undefined, counter: 0 });
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri1, true);
            xhr.send(null);
        });
        const myRef = firebase.database().ref();
        const Key = myRef.push();
        const reference = firebase.storage().ref().child('audio/' + Key);

        const snapshot = await reference.put(blob);
        const myUrl = await snapshot.ref.getDownloadURL();
        this.setState({ audioUrl: myUrl, uploaded: true })
    }

    renderModalContent = () => (
        <View style={styles.modalView}>

            <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', marginBottom: 35 }}>Post</Text>
            <View style={styles.inputView} >
                <TextInput
                    style={styles.inputText}
                    placeholder="Description..."
                    placeholderTextColor="#fff"
                    onChangeText={text => this.setState({ Description: text })} />
                {this.state.uploaded ? (
                    <Ionicons name="ios-checkmark" color="#fff" size={35} />
                ) : (
                        <TouchableOpacity onPress={() => this.state.recording ? this.stopRecording() : this.startRecording()} style={{ backgroundColor: '#fff', paddingHorizontal: 11, paddingVertical: 2, borderRadius: 40, marginLeft: 10 }}>
                            {!this.state.recording ?
                                <Ionicons name="ios-mic" color="#773838" size={27} />
                                :
                                <Text style={{ color: '#773838', fontSize: 18 }}>{this.state.counter}</Text>
                            }
                        </TouchableOpacity>
                    )}

                <TouchableOpacity onPress={this._pickImage} style={{ backgroundColor: '#fff', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 40, marginLeft: 10 }}>
                    <Ionicons name="md-image" color="#773838" size={27} />
                </TouchableOpacity>
            </View>


            {/* <View >
                <TouchableOpacity style={styles.recording} onPress={() => this.state.recording ? this.stopRecording() : this.startRecording()}>
                    <Text style={{ flex: 1, color: '#fff' }}>{this.state.recording ? this.state.counter : 'Start Recording...'}</Text>
                    <Ionicons style={{ marginRight: 15 }} name="ios-mic" color="#fff" size={27} />
                </TouchableOpacity>
            </View> */}


            <StarRating
                disabled={false}
                maxStars={5}
                rating={this.state.starCount}
                selectedStar={(rating) => this.onStarRatingPress(rating)}
                fullStarColor={'red'}
            />

            <Text>How's your day?</Text>

            <View style={{ marginVertical: 20, display: 'flex', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-start' }} >
                <CheckBox
                    disabled={false}
                    value={this.state.specialPost}
                    onValueChange={(newValue) => this.setState({ specialPost: newValue })}
                />
                <Text>Special Post</Text>
            </View>

            <TouchableOpacity onPress={() => this.Post()} style={styles.forgotBtn}>
                <Text style={styles.loginText}>Post</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => this.setState({ Post: false })}>
                <Text style={{ fontSize: 17, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>

        </View >
    );


    backAction = () => {
        Alert.alert('Exit App!', 'Are you sure you want to exit?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
    };


    async componentDidMount() {

        const backHandler = BackHandler.addEventListener('hardwareBackPress', this.backAction);

        // backHandler.remove();
        let userName = firebase.auth().currentUser.displayName ? firebase.auth().currentUser.displayName : ''

        const identifier = await Notifications.scheduleNotificationAsync({
            content: {
                title: "Hi " + userName,
                body: "it's time to journal? How are you today?",
            },
            trigger: {
                hour: 18,
                minute: 55,
                repeats: true
            },
        });
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        }
        let uid = firebase.auth().currentUser.uid
        firebase
            .database()
            .ref('Post').orderByChild('User').equalTo(uid)
            .on("value", snapshot => {
                const data = snapshot.val()
                const count = snapshot.numChildren();
                if (snapshot.val()) {
                    const initMessages = [];
                    Object
                        .keys(data)
                        .forEach(message => initMessages.push(data[message]));

                    var reversed = initMessages.reverse()
                    this.setState({ messages: reversed })
                }
            });

        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                this.setState({ logged: true })
                if (user.displayName != null) {
                    this.setState({ name: user.displayName })
                } else {
                    this.setState({ name: user.email })
                }
            }
        })
    }
    Delete = async (item) => {
        await firebase.database().ref('Post').child(item.Node).remove(function (error) {
            if (!error) {
                Alert.alert("Deleted")
            }
            else if (error) {
                Alert.alert(error);
            }
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



    canPost = async () => {
        // var user = firebase.auth().currentUser.uid;
        // let userName;
        // var docRef = firebase.firestore().collection("Users").doc(user);
        // let can_post = true;
        // let time = null;

        // await docRef.get().then(function (doc) {
        //     if (doc.exists) {
        //         userName = doc.data().username
        //         if (doc.data().lastPosts) {
        //             if (doc.data().lastPosts.length === 3) {
        //                 console.log('---lastPost---', doc.data().lastPosts);
        //                 if (((new Date().getTime() - doc.data().lastPosts[2]) / (1000 * 3600 * 24)) < 1) {
        //                     if ((((new Date().getTime() - doc.data().lastPosts[0]) / (1000 * 3600 * 24)) < 1)) {

        //                         can_post = false;
        //                         let date = new Date();
        //                         time = new Date(doc.data().lastPosts[0]).setDate(date.getDate() + 1);
        //                         console.log('---time---', time);
        //                         time = time - new Date().getTime();
        //                         time = time / 1000;
        //                         console.log(time);

        //                     }
        //                 }
        //             }
        //         }
        //         console.log("Document data:", doc.data().username);
        //     } else {
        //         console.log("5No such document!");
        //     }
        // }).catch(function (error) {
        //     console.log("Error getting document:", error);
        // });
        this.setState({ Post: true });
        // if (can_post) {
        //     this.setState({ Post: true });
        // }
        // else {
        //     this.setState({ postQuota: true, time: time });
        // }
    }

    // renderModalPostQuota() {
    //     return (
    //         <View style={[styles.modalView, { backgroundColor: '#000' }]}>
    //             {/* <Text style={{ textAlign: 'center', fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 25 }}>{this.state.time}</Text>  */}
    //             <Timer callback={this.props} time={this.state.time} />

    //             <Text style={{ marginHorizontal: 20, fontWeight: 'bold', color: '#FFF', textAlign: 'center', marginTop: 10 }}>You've reached your quota of <Text style={{ color: "#7F171B", fontSize: 18 }}>3</Text> posts per <Text style={{ color: "#7F171B", fontSize: 18 }}>24</Text> hours. Please wait until you unlock next post.</Text>

    //             <TouchableOpacity style={{ alignSelf: 'flex-end', marginRight: 10, marginTop: 15 }} onPress={() => this.setState({ postQuota: false })}>
    //                 <MaterialCommunityIcons name="close-circle" color="#fff" size={25} />
    //             </TouchableOpacity>

    //         </View >
    //     )
    // }


    LastPost(user, date) {
        firebase.firestore().collection("Users").doc(user).get().then((doc) => {
            if (doc.exists) {
                let userData = doc.data();
                if (userData.lastPosts) {
                    if (userData.lastPosts.length < 3) {
                        userData.lastPosts.push(date)
                    }
                    else {
                        userData.lastPosts[0] = userData.lastPosts[1];
                        userData.lastPosts[1] = userData.lastPosts[2];
                        userData.lastPosts[2] = date;
                    }
                }

                firebase.firestore().collection("Users").doc(user).update({
                    lastPosts: userData.lastPosts ? userData.lastPosts : [date]
                })


            }
        }).catch(function (error) {
            console.log("2Error getting document:", error);
        });
    }

    Post = async () => {
        var user = firebase.auth().currentUser.uid;

        let userName;
        var docRef = firebase.firestore().collection("Users").doc(user);

        await docRef.get().then(function (doc) {
            if (doc.exists) {
                userName = doc.data().username
                console.log("Document data:", doc.data().username);
            } else {
                userName = 'Anonymous'
                // doc.data() will be undefined in this case
                console.log("5No such document!");
            }
        }).catch(function (error) {
            console.log("Error getting document:", error);
        });
        var nodeName = 'Post';

        if (this.state.Description != '') {
            let date = new Date().getTime();
            let that = this;
            var newPostRef = firebase.database().ref(nodeName).push({
                User: user,
                Image: this.state.Image,
                Name: userName,
                StarRating: this.state.starCount,
                Description: this.state.Description,
                Date: new Date().toDateString(),
                Node: "null",
                Likes: 0,
                specialPost: this.state.specialPost,
                audioUrl: this.state.audioUrl ? this.state.audioUrl : false
            }).then((data) => {
                this.setState({ Description: '', counter: 0, uploaded: false })
                this.setState({ Post: false })
                Alert.alert(
                    'Upload Successfully'
                )
                var Key = data.key
                firebase.database().ref(nodeName).child(Key).update({
                    Node: Key
                })
                this.LastPost(user, date);

            }).catch((error) => {
                //error callback
                console.log('Upload Not Successfully' + error);
            })
        }

        else {
            Alert.alert("Please Fill The Form Proper.")
        }
    }

    async playSound(audio) {
        const sound = new Audio.Sound();
        // sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        await sound.loadAsync({ uri: audio });


        await sound.playAsync()
    }

    renderRow = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: 20, marginVertical: 10, backgroundColor: '#fff', padding: 2, borderRadius: 5 }}>
                {item.Image ? <Image source={{ uri: item.Image }}
                    style={{ height: item.Image ? 200 : 0, width: '100%' }}
                /> : null}
                <View style={{ padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 1 }}>{item.Description}</Text>
                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => this.Delete(item)}>
                            <Ionicons name='ios-trash' color='grey' size={25} />
                        </TouchableOpacity>
                    </View>
                    {item.audioUrl && (
                        <TouchableOpacity onPress={() => this.playSound(item.audioUrl)}>
                            <Ionicons style={{ paddingVertical: 10}} name='ios-play-circle' color='grey' size={40} />
                        </TouchableOpacity>
                    )}
                    <Text style={{ color: 'grey', textAlign: 'right', fontSize: 13, marginVertical: 5 }}>-{item.Name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
                            {item.specialPost && (<Ionicons name='md-star' color='#7F171B' size={20} />)}
                        </View>
                        <Text style={{ color: 'grey', textAlign: 'right', fontSize: 13 }}>{item.Date}</Text>
                    </View>
                </View>
            </View>
        )
    }

    render() {
        var userId = firebase.auth().currentUser.uid
        let redirectUrl = Linking.makeUrl('', { uid: userId });
        let { path, queryParams } = Linking.parse(redirectUrl);
        return (
            <View style={styles.container}>
                <Modal
                    // isVisible={this.state.Post || this.state.postQuota}
                    isVisible={this.state.Post}
                    backdropColor="rgba(0,0,0,0.1)"
                    animationIn="zoomInDown"
                    animationOut="zoomOutUp"
                    animationInTiming={600}
                    animationOutTiming={600}
                    backdropTransitionInTiming={600}
                    backdropTransitionOutTiming={600}
                    onBackdropPress={() => this.setState({ Post: false, postQuota: false })}
                    style={{ overflow: 'scroll' }}>
                    {/* {this.state.postQuota ? this.renderModalPostQuota() : this.renderModalContent()} */}
                    {this.renderModalContent()}
                </Modal>
                <View style={{ paddingTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.openDrawer()}
                        style={{ padding: 8, width: 60, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name='md-menu' color='#7F171B' size={35} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 'bold', marginLeft: -28 }}>Welcome {this.state.name}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.messages}
                        initialNumToRender={4}
                        extraData={this.state}
                        renderItem={this.renderRow}
                        keyExtractor={(item, index) => index.toString()}

                    />
                </View >
                <TouchableOpacity onPress={() => this.canPost()} style={{ position: 'absolute', bottom: 20, right: 20 }}>
                    <Ionicons name='md-add-circle' color='grey' size={60} />
                </TouchableOpacity>
            </View>
        )
    }
}

HomeScreen.navigationOptions = {
    header: null,
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#7F171B',
    },
    Title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingHorizontal: 20
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
    inputView: {
        width: "90%",
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

    recording: {
        width: "80%",
        backgroundColor: "#fb5b5a",
        borderRadius: 25,
        height: 50,
        marginBottom: 20,
        // justifyContent: "center",
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row',
        display: 'flex'
    },
    loginText: {
        color: '#fff'
    }

});
