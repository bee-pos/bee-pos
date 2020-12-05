import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Logo from '../../assets/logo.png';
import AnimatedTextEllipsis from '../components/animated-text-ellipsis';
import Colors from '../utils/colors';
import Variables from '../utils/variables';

const SplashScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={Logo} />
            <AnimatedTextEllipsis style={styles.message} textStyle={styles.message__text} text="Đồng bộ dữ liệu" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.styledBackgroundColor
    },
    message: {
        marginTop: Variables.defaultMargin
    },
    message__text: {

    }
})

export default SplashScreen;