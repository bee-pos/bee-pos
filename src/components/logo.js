import React from 'react';
import { StyleSheet, Text } from 'react-native';
import Colors from '../utils/colors';

const Logo = ({ size = 256, style = {} }) => {
    const sizeStyle = { fontSize: size };
    return (
        <Text style={[styles.logo, sizeStyle, style]}>BEE</Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        fontFamily: 'AmaticSC-Bold',
        color: Colors.primaryColor
    }
})

export default Logo;