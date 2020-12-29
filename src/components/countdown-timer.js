import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../utils/colors';

const CountdownTimer = forwardRef(({ message, seconds = 0, onTimeout = () => { }, auto = true, display = true }, ref) => {
    /*
     * Keep assigned value of setInterval() call to clear interval when unmount component 
     */
    const countdownIntervalRef = useRef();

    /*
     * Keep current seconds when counting down
     */
    const currentSecondsRef = useRef(seconds);

    /*
     * The current countdown seconds to render
     */
    const [currentSeconds, setCurrentSeconds] = useState(seconds);

    /*
     * Expose functions to control countdown timer
     */
    useImperativeHandle(ref, () => ({ start, reset }));

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
                <Text style={styles['countdown-time']}>{secondsToStr(currentSeconds)}</Text>
            </View>}
        </>
    )

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
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = undefined;
        }
    }

    function secondsToStr(numOfSeconds) {
        const seconds = numOfSeconds % 60;
        const minutes = (numOfSeconds - seconds) / 60;
        return [minutes < 10 ? `0${minutes}` : `${minutes}`,
            seconds < 10 ? `0${seconds}` : `${seconds}`].join(' : ');
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