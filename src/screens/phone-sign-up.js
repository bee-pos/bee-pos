import React, { useRef } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Flag from '../../assets/flag-vn.png';
import HeaderLogo from '../../assets/header-logo.png';
import Colors from '../utils/colors';
import Styles from '../utils/styles';
import Variables from '../utils/variables';
import { showMessage, hideMessage } from "react-native-flash-message";

const PhoneSignUp = ({ navigation, onSignUp }) => {
    const PHONE_PREFIX = '+84';
    const phone = useRef('+84363514804');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={HeaderLogo} height={60} />
            </View>
            <View style={styles.body}>
                <Text style={styles['welcome-text']}>Xin chào</Text>
                <Text style={styles['sign-in-text']}>Bạn đã sẵn sàng chưa, nhập số điện thoại để đăng nhập</Text>
                <View style={styles['phone-input-container']}>
                    <Image source={Flag} />
                    <Text style={styles['phone-input-container__prefix']}>{PHONE_PREFIX}</Text>
                    <TextInput style={styles['phone-input-container__input']} onChangeText={onPhoneChanged}
                        maxLength={11} autoFocus={true} clearButtonMode='always' keyboardType='numeric'
                        placeholder='Số điện thoại' value={phone.current} />
                </View>
            </View>
            <View style={styles.footer}>
                <TouchableOpacity style={[Styles.cirle, Styles['icon-button']]} onPress={signUp} >
                    <Icon name="arrow-forward-outline" size={Variables.largeFontSize} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )

    function onPhoneChanged(input) {
        phone.current = input;
    }

    async function signUp() {
        const signedUp = await onSignUp(phone.current);
        if (signedUp) {
            navigation.navigate('PhoneSignIn');
            return;
        }

        showMessage({
            message: "Lỗi",
            description: "Đã có lỗi xảy ra, vui lòng thử lại.",
            type: "error",
        });
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        height: 80,
        padding: Variables.defaultPadding
    },
    body: {
        flex: 1,
        padding: Variables.defaultPadding,
    },
    'welcome-text': {
        fontSize: Variables.largeFontSize,
        fontWeight: 'bold'
    },
    'sign-in-text': {

    },
    'phone-input-container': {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 40
    },
    'phone-input-container__prefix': {
        fontWeight: 'bold',
        paddingLeft: 10
    },
    'phone-input-container__input': {
        fontSize: Variables.mediumFontSize,
        paddingLeft: 10
    },
    footer: {
        position: 'absolute',
        bottom: Variables.defaultPadding,
        right: Variables.defaultPadding,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
});

export default PhoneSignUp;