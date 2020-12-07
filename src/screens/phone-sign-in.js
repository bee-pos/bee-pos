import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons';
import CoundownTimer from '../components/countdown-timer';
import Colors from '../utils/colors';
import Styles from '../utils/styles';
import Variables from '../utils/variables';

const PhoneSignIn = ({ route: { params: { phone } }, otpAuthentication, onSignedIn }) => {
    const OTP_EXPIRED_SECONDS = 300;
    const ENABLE_RESEND_SECONDS = 0;

    const otpCode = useRef();
    const coundownTimerRef = useRef();
    const resendIntervalRef = useRef();

    const [spinning, showSpinner] = useState(false);
    const [disableResend, setDisableResend] = useState(true);

    useEffect(setupResendTimer, []);

    return (
        <>
            <View style={styles.container}>
                <Spinner visible={spinning} size="large" color={Colors.styledColor} />
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
                        <TouchableOpacity disabled={disableResend} onPress={resend} >
                            <Text style={[styles['re-send-btn'], disableResend ? styles['re-send-btn--disabled'] : '']} >
                                Gửi lại mã kích hoạt
                        </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[Styles.cirle, Styles['icon-button']]} onPress={signIn} >
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
        setDisableResend(false);
    }

    async function signIn() {
        try {
            const { additionalUserInfo: { isNewUser }, user } = await _firebasePhoneSignIn(otpCode.current);
            onSignedIn({ user, isNewUser });
        } catch (error) {
            console.log(error);
            showMessage({ message: 'Xác thực OTP', description: 'Mã OTP không chính xác', type: 'error' });
        }
    }

    function _firebasePhoneSignIn(code) {
        return otpAuthentication.confirm(code);
    }

    function resend() {
        setDisableResend(true);
        resetResendTimer();
        coundownTimerRef.current.onReset();
        showMessage({
            message: 'Xác thực OTP',
            description: 'Mã OTP đã được gửi lại',
            type: 'success',
        });
    }

    function setupResendTimer() {
        _startResendTimer();
        return _closeResendTimer;
    }

    function resetResendTimer() {
        _closeResendTimer();
        _startResendTimer();
    }

    function _startResendTimer() {
        resendIntervalRef.current = setInterval(() => {
            setDisableResend(false);
            _closeResendTimer();
        }, ENABLE_RESEND_SECONDS * 1000);
    }

    function _closeResendTimer() {
        clearInterval(resendIntervalRef.current);
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
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