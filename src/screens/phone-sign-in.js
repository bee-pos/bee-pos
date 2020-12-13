import React, { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/Ionicons';
import CoundownTimer from '../components/countdown-timer';
import Colors from '../utils/colors';
import { firebasePhoneSignIn, firebasePhoneSignUp } from '../utils/firebase-utils';
import { hideSpinner, showSpinner } from '../utils/spinner/spinner-utils';
import Styles from '../utils/styles';
import Variables from '../utils/variables';

const PhoneSignIn = ({ route: { params: { phone } }, otpAuthentication, onSignedIn }) => {
    const OTP_EXPIRED_SECONDS = 60;

    const otpCode = useRef();
    const coundownTimerRef = useRef();

    const [otpConfirmation, setOtpConfirmation] = useState(otpAuthentication);
    const [disallowResend, setDisallowResend] = useState(true);

    return (
        <>
            <View style={styles.container}>
                <View style={styles.body}>
                    <Text style={styles['confirmed-text']}>Xác nhận</Text>
                    <Text>{`Nhập 6 ký tự được gửi tới số `}</Text>
                    <Text style={styles['phone-text']}>{phone}</Text>
                    <TextInput style={styles['phone-input']} autoFocus={true} onChangeText={onOtpCodeChanged}
                        clearButtonMode='always' keyboardType='numeric' placeholder='000000'
                        maxLength={6} textAlign='left' />
                    <CoundownTimer ref={coundownTimerRef} message='Thời gian còn lại'
                        seconds={OTP_EXPIRED_SECONDS} onTimeout={onOtpCodeExpired} />
                </View>
                <View style={styles.footer}>
                    <View>
                        <Text>Bạn không nhận được mã kích hoạt?</Text>
                        <TouchableOpacity disabled={disallowResend} onPress={resendOtpCode} >
                            <Text style={[styles['re-send-btn'], disallowResend ? styles['re-send-btn--disabled'] : '']} >
                                Gửi lại mã kích hoạt
                        </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[Styles.cirle, Styles['icon-button']]} onPress={signInByOtpCode} >
                        <Icon name='arrow-forward-outline' size={Variables.largeFontSize} color={Colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )

    function onOtpCodeChanged(otp) {
        otpCode.current = otp;
    }

    function onOtpCodeExpired() {
        setDisallowResend(false);
    }

    async function signInByOtpCode() {
        showSpinner();

        try {
            const { additionalUserInfo: { isNewUser }, user } =
                await firebasePhoneSignIn(otpConfirmation, otpCode.current);
            onSignedIn({ user, isNewUser });
        } catch (error) {
            switch (error.code) {
                case 'auth/missing-verification-code':
                    showMessage({ message: 'Bạn chưa nhập vào mã OTP', type: 'danger' });
                    break;
                case 'auth/invalid-verification-code':
                    showMessage({ message: 'Mã OTP không chính xác', type: 'danger' });
                    break;
                case 'auth/session-expired':
                    showMessage({ message: 'Mã OTP đã hết hạn', type: 'danger' });
                    break;
                default:
                    console.log(error);
                    showMessage({ message: 'Đã có lỗi xảy ra', type: 'danger' });
            }
        } finally {
            hideSpinner();
        }
    }

    async function resendOtpCode() {
        setDisallowResend(true);
        showSpinner();

        try {
            const otpConfirmation = await firebasePhoneSignUp(phone);
            setOtpConfirmation(otpConfirmation);

            coundownTimerRef.current.onReset();
            showMessage({ message: 'Mã OTP đã được gửi lại', type: 'success' });
        } catch (error) {
            switch (error.code) {
                case 'auth/user-disabled':
                    showMessage({ message: 'Tài khoản tạm thời vô hiệu', type: 'danger' });
                    break;
                case 'auth/too-many-requests':
                    showMessage({ message: 'Tài khoản tạm khóa', description: 'Bạn đã gửi quá nhiều yêu cầu trong thời gian ngắn', type: 'danger' });
                    break;
                case 'auth/missing-phone-number':
                case 'auth/invalid-phone-number':
                case 'auth/captcha-check-failed':
                case 'auth/quota-exceeded':
                case 'auth/operation-not-allowed':
                default:
                    console.log(error);
                    showMessage({ message: 'Đã có lỗi xảy ra', type: 'danger' });
            }
        } finally {
            hideSpinner();
        }
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    body: {
        flex: 1,
        padding: Variables.defaultPadding
    },
    'confirmed-text': {
        fontSize: Variables.largeFontSize,
        fontWeight: 'bold'
    },
    'phone-text': {
        fontSize: Variables.mediumFontSize,
        color: Colors.styledColor
    },
    'phone-input': {
        color: Colors.grey,
        fontSize: Variables.mediumFontSize,
        fontWeight: 'bold',
        paddingLeft: 0,
        paddingTop: 40,
        paddingBottom: 40,
        letterSpacing: 10
    },
    're-send-btn': {
        ...Styles.anchor
    },
    're-send-btn--disabled': {
        ...Styles['anchor--disabled']
    },
    footer: {
        position: 'absolute',
        left: Variables.defaultPadding,
        bottom: Variables.defaultPadding,
        right: Variables.defaultPadding,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default PhoneSignIn;