import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../utils/colors';

const CountdownTimer = forwardRef(({ message, seconds = 0, onTimeout = () => { }, auto = true, display = true }, ref) => {
    /*
     * Keep assigned value of setInterval() call to close when unmount component 
     */
    const countdownIntervalRef = useRef();

    /*
     * Keep current seconds when counting down
     */
    const currentSecondsRef = useRef(seconds);

    /*
     * The seconds to render
     */
    const [currentSeconds, setCurrentSeconds] = useState(seconds);

    useImperativeHandle(ref, () => ({ start, getSeconds, reset }));

    useEffect(() => {
        if (auto) {
            _startCoundownTimer();
        }
        return _closeCoundownTimer;
    }, []);

    return (
        <>
            {display && <View style={styles.container}>
                <Text style={styles.message}>{message} </Text>
                <Text style={styles['countdown-time']}>{secondsToStr()}</Text>
            </View>}
        </>
    )

    function secondsToStr() {
        const seconds = currentSeconds % 60;
        const minutes = (currentSeconds - seconds) / 60;
        return [minutes < 10 ? `0${minutes}` : `${minutes}`,
        seconds < 10 ? `0${seconds}` : `${seconds}`].join(' : ');
    }

    function start() {
        _startCoundownTimer();
    }

    function reset() {
        _closeCoundownTimer();

        setCurrentSeconds(seconds);
        currentSecondsRef.current = seconds;

        if (auto) {
            _startCoundownTimer();
        }
    }

    function getSeconds() {
        return currentSeconds;
    }

    function _startCoundownTimer() {
        if (countdownIntervalRef.current) {
            return;
        }

        const startedTime = new Date().getTime();
        countdownIntervalRef.current = setInterval(() => {
            currentSecondsRef.current = seconds - parseInt((new Date().getTime() - startedTime) / 1000);
            if (currentSecondsRef.current <= 0) {
                currentSecondsRef.current = 0;
                _closeCoundownTimer();
                onTimeout();
            }

            setCurrentSeconds(currentSecondsRef.current);
        }, 1000);
    }

    function _closeCoundownTimer() {
        clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = 0;
    }
});

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row'
    },
    message: {

    },
    'countdown-time': {
        color: Colors.primaryColor
    }
});

export default CountdownTimer;