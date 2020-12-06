import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../utils/colors';

const CountdownTimer = forwardRef(({ message, seconds = 0, onTimeout = () => { } }, ref) => {
    const countdownIntervalRef = useRef();
    const currentSecondsRef = useRef(seconds);

    const [currentSeconds, setCurrentSeconds] = useState(seconds);

    useImperativeHandle(ref, () => ({ onReset }));

    useEffect(setupCoundownTimer, []);

    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message} </Text>
            <Text style={styles['countdown-time']}>{secondsToStr()}</Text>
        </View>
    )

    function secondsToStr() {
        const seconds = currentSeconds % 60;
        const minutes = (currentSeconds - seconds) / 60;
        return [minutes < 10 ? `0${minutes}` : `${minutes}`,
        seconds < 10 ? `0${seconds}` : `${seconds}`].join(' : ');
    }

    function setupCoundownTimer() {
        _openCoundownTimer();
        return _closeCoundownTimer;
    }

    function onReset() {
        _closeCoundownTimer();
        _openCoundownTimer();

        setCurrentSeconds(seconds);
        currentSecondsRef.current = seconds;
    }

    function _openCoundownTimer() {
        countdownIntervalRef.current = setInterval(() => {
            setCurrentSeconds(--currentSecondsRef.current);
            if (currentSecondsRef.current == 0) {
                _closeCoundownTimer();
                onTimeout();
            }
        }, 1000);
    }

    function _closeCoundownTimer() {
        clearInterval(countdownIntervalRef.current);
    }
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    message: {

    },
    'countdown-time': {
        color: Colors.styledColor
    }
});

export default CountdownTimer;