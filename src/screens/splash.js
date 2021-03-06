import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import AnimatedTextEllipsis from '../components/animated-text-ellipsis';
import Logo from '../components/logo';
import Colors from '../utils/colors';
import Variables from '../utils/variables';

const SplashScreen = () => {
    return (
        <>
            <StatusBar backgroundColor={Colors.primaryBackgroundColor} barStyle="dark-content" />
            <View style={styles.container}>
                <Logo />
                <AnimatedTextEllipsis style={styles.message} textStyle={styles.message__text} text="Đồng bộ dữ liệu" />
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryBackgroundColor
    },
    message: {
        marginTop: Variables.defaultMargin
    },
    message__text: {
        fontSize: Variables.smallFontSize,
    }
})

export default SplashScreen;