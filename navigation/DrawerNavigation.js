import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Home from '../Screens/Home';
import analytics from '../Screens/analytics';

import CustomDrawer from './CustomDrawer'


const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <Drawer.Navigator
            initialRouteName="Home"
            drawerType="front"
            drawerStyle={{ width: '85%' }}
            drawerContent={(props) => <CustomDrawer {...props} />}>
            <Drawer.Screen name="Home" component={Home} />
            {/* <Drawer.Screen name="LeaderBoard" component={LeaderBoard} /> */}
            <Drawer.Screen name="analytics" component={analytics} />
        </Drawer.Navigator>
    );
}