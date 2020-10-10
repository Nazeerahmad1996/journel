import * as React from 'react';
import { Image, Dimensions, StyleSheet, Text, TouchableOpacity, View, FlatList, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import * as firebase from 'firebase';
import '@firebase/firestore'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Leaderboard from 'react-native-leaderboard';

export default class HomeScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: [

            ]
        }
    }


    async getDate() {
        const snapshot = await firebase.firestore().collection('events').get()
        return snapshot.docs.map(doc => doc.data());
    }


    async componentDidMount() {
        let that = this;
        this.setState({ data: [] })
        await firebase.firestore().collection('Users').onSnapshot(function (querySnapshot) {
            let data = [];
            querySnapshot.forEach(function (doc) {
                data.push(doc.data());
            });
            let data2 = data.sort(function (a, b) { return b.Score - a.Score });

            that.setState({ data: data2 }, () => console.log(that.state.data))
        });
        // .then(querySnapshot => {
        //     querySnapshot.docs.forEach(doc => {
        //         data.push(doc.data());
        //     });
        // });



    }


    renderItem = ({ item, index }) => {
        return (
            <View style={{ padding: 10, marginLeft: 40, backgroundColor: '#fff', marginBottom: 20, marginRight: 20, borderRadius: 10, flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: '#f9f9f9', justifyContent: 'center', alignItems: 'center', marginLeft: -35, marginRight: 20 }}>
                    <Text style={{ fontSize: 8 }}>Score</Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.Score}</Text>
                </View>
                <Text>{index + 1}.  </Text>
                <Text>{item.username}  </Text>
            </View>
        )
    }




    render() {
        return (
            <View style={styles.container}>
                <View style={{ paddingTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.openDrawer()}
                        style={{ padding: 8, backgroundColor: '#4863A0', width: 60, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name='md-menu' color='#fff' size={35} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold' }}>Leaderboard</Text>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Home')}
                        style={{ padding: 8, backgroundColor: '#fb5b5a', width: 60, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name='md-home' color='#fff' size={35} />
                    </TouchableOpacity>
                </View>
                {/* <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>Leaderboard</Text> */}
                {/* <FlatList
                    // style={styles.container}
                    data={this.state.data.slice(0, 5)}
                    renderItem={this.renderItem}
                // keyExtractor={extractKey}
                /> */}
                <Leaderboard
                    data={this.state.data.slice(0, 5)}
                    sortBy='Score'
                    labelBy='username' />
            </View >
        )
    }
}

HomeScreen.navigationOptions = {
    header: null,
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#fff',
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    Title: {
        fontSize: 30,
        fontWeight: 'bold',
        paddingHorizontal: 20
    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue',
    },


});
