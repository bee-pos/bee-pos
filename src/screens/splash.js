import React from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedTextEllipsis from '../components/animated-text-ellipsis';
import Logo from '../components/logo';
import Colors from '../utils/colors';
import Variables from '../utils/variables';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Logo />
            <AnimatedTextEllipsis style={styles.message} textStyle={styles.message__text} text="Đồng bộ dữ liệu" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primaryBackgroundColor
    },
    bee__logo: {
        fontFamily: 'AmaticSC-Bold',
        fontSize: 256,
        color: Colors.primaryColor,
        borderColor: 'red',
        borderWidth: 1,
        padding: 0
    },
    message: {
        marginTop: Variables.defaultMargin
    },
    message__text: {

    }
})

export default SplashScreen;