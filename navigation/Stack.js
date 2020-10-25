import React, { useState, useEffect } from 'react';
import Home from '../Screens/Home';
import Register from '../Screens/Register';
import DrawerNavigation from './DrawerNavigation';
import PhoneLogin from '../Screens/PhoneLogin';
import UsernameUpdate from '../Screens/UsernameUpdate';
import * as firebase from 'firebase';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

function NavStack() {
    const [isLoggedIn, setisLoggedIn] = useState('');
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user.email != null) {
                setisLoggedIn(true)
            } else {
                setname(false)
            }
        })
    }, []);
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            headerMode={false}>
            {isLoggedIn ? (
                <>
                    <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
                    <Stack.Screen name="UsernameUpdate" component={UsernameUpdate} />
                </>
            ) : (
                    <>
                        <Stack.Screen name="Register" component={Register} />
                        <Stack.Screen name="PhoneLogin" component={PhoneLogin} />
                    </>
                )}
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