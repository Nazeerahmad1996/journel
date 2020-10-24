import * as React from 'react';
import { Image, Dimensions, StyleSheet, Text, TouchableOpacity, View, FlatList, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import * as firebase from 'firebase';
import '@firebase/firestore'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart, Grid, BarChart, XAxis, YAxis } from 'react-native-svg-charts'
export default class analytics extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }


    async componentDidMount() {
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
                        .forEach(message => initMessages.push(data[message].StarRating));
                    console.log(initMessages);
                    var reversed = initMessages.reverse()
                    reversed = reversed.slice(0, 30)
                    this.setState({ data: reversed })
                }
            });

    }







    render() {
        const fill = 'rgb(134, 65, 244)'
        const data = [50, 10, 40, 95, 4, 24, 0, 35, 53, 53, 24, 50, 20, 80]
        console.log(this.state.data);
        const contentInset = { top: 20, bottom: 20 }
        // let data = this.state.data
        return (
            <View style={styles.container}>
                <View style={{ paddingTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.openDrawer()}
                        style={{ padding: 8, width: 60, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name='md-menu' color='#7F171B' size={35} />
                    </TouchableOpacity>
                    <Text style={{ flex: 1, textAlign: 'center', fontSize: 17, fontWeight: 'bold', marginLeft: -28 }}>Last 15 days analytics</Text>
                </View>
                {/* <LineChart
                    style={{ height: 400 }}
                    data={this.state.data}
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={{ top: 100, bottom: 20 }}
                >
                    <Grid />
                </LineChart> */}
                <View style={{ marginHorizontal: 20 }}>
                    <BarChart contentInset={contentInset} style={{ height: 500 }} data={this.state.data} svg={{ fill }}>
                        <Grid />
                    </BarChart>
                    <XAxis
                        style={{ marginHorizontal: -10 }}
                        data={this.state.data}
                        formatLabel={(value, index) => index}
                        contentInset={{ left: 10, right: 10 }}
                        svg={{ fontSize: 10, fill: 'black' }}
                    />
                </View>
            </View >
        )
    }
}

analytics.navigationOptions = {
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
