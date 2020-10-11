import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from 'react-native';

const formatNumber = number => `0${number}`.slice(-2);

const getRemaining = (totalSeconds) => {

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return { hours: hours, mins: minutes, secs: seconds };
}

export default function Timer({ time }) {
    const [remainingSecs, setRemainingSecs] = useState(time);
    const [isActive, setIsActive] = useState(true);
    const { hours, mins, secs } = getRemaining(remainingSecs);

    const toggle = () => {
        setIsActive(!isActive);
    }

    const reset = () => {
        setIsActive(false);
        setRemainingSecs(0);
    }

    //   const deadline = () => {
    //       return callback.navigation.state.params.deadlineReached()
    //   }

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setRemainingSecs(remainingSecs => remainingSecs - 1);
            }, 1000);
            if (remainingSecs < 5) {
                // deadline()  
            }
            if (remainingSecs <= 0) {
                reset()
            }
        } else if (!isActive && remainingSecs !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, remainingSecs]);


    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.timerText}>{`${hours} : ${mins} : ${secs}`}</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        alignItems: 'center',
        justifyContent: 'center',
    },
    timerText: {
        color: '#fff',
        fontSize: 18,
    },
    buttonReset: {
        marginTop: 20,
        borderColor: "#FF851B"
    },
    buttonTextReset: {
        color: "#FF851B"
    }
});