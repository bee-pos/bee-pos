import auth from '@react-native-firebase/auth';
import React, { useRef } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from "react-native-flash-message";
import Icon from 'react-native-vector-icons/Ionicons';
import Flag from '../../assets/flag-vn.png';
import HeaderLogo from '../../assets/header-logo.png';
import Colors from '../utils/colors';
import Styles from '../utils/styles';
import Variables from '../utils/variables';

const PhoneSignUp = ({ onSignedUp }) => {
    const PHONE_PREFIX = '+84';
    const phone = useRef();

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
                    <Icon name='arrow-forward-outline' size={Variables.largeFontSize} color={Colors.white} />
                </TouchableOpacity>
            </View>
        </View>
    )

    function onPhoneChanged(value) {
        phone.current = `${PHONE_PREFIX}${value}`;
    }

    async function signUp() {
        phone.current = '+84363514804';
        try {
            const otpAuthentication = await _firebasePhoneSignUp(phone.current);
            onSignedUp(phone.current, otpAuthentication);
        } catch (error) {
            switch (error.code) {
                case 'auth/missing-phone-number':
                    showMessage({ message: 'Bạn chưa nhập số điện thoại', type: 'danger' });
                    break;
                case 'auth/invalid-phone-number':
                    showMessage({ message: 'Nhập vào số điện thoại không đúng', type: 'danger' });
                    break;
                case 'auth/user-disabled':
                    showMessage({ message: 'Tài khoản tạm thời vô hiệu', type: 'danger' });
                    break;
                case 'auth/too-many-requests':
                    showMessage({ message: 'Tài khoản tạm khóa', description: 'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn', type: 'danger' });
                    break;
                case 'auth/captcha-check-failed':
                case 'auth/quota-exceeded':
                case 'auth/operation-not-allowed':
                default:
                    console.log(error);
                    showMessage({ message: 'Đã có lỗi xảy ra', type: 'danger' });
            }
        }
    }

    function _firebasePhoneSignUp(phone) {
        return auth().signInWithPhoneNumber(phone)
            .then(otpAuthentication => otpAuthentication);
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
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