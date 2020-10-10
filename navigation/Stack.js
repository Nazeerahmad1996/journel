import React from 'react';
import Home from '../Screens/Home';
import Register from '../Screens/Register';
import DrawerNavigation from './DrawerNavigation';
import PhoneLogin from '../Screens/PhoneLogin';
import UsernameUpdate from '../Screens/UsernameUpdate';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function NavStack() {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            headerMode={false}
            initialRouteName="Register">
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
            <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
            <Stack.Screen name="UsernameUpdate" component={UsernameUpdate} />
        </Stack.Navigator>
    );
}

export default function AppContainer() {
    return (
        <NavigationContainer>
            <NavStack />
        </NavigationContainer>
    );
}