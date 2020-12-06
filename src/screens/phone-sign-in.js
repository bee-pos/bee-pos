import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/Ionicons';
import CoundownTimer from '../components/countdown-timer';
import Colors from '../utils/colors';
import Styles from '../utils/styles';
import Variables from '../utils/variables';
import { showMessage, hideMessage } from "react-native-flash-message";

const PhoneSignIn = ({ navigation, onSignIn }) => {
    const OTP_EXPIRED_SECONDS = 300;
    const ENABLE_RESEND_SECONDS = 0;

    const otpCode = useRef();
    const coundownTimerRef = useRef();
    const enableResendIntervalRef = useRef();

    const [spinning, showSpinner] = useState(false);
    const [disableResend, setDisableResend] = useState(true);

    useEffect(setupEnableResendTimer, []);

    return (
        <>
            <View style={styles.container}>
                <Spinner visible={spinning} size="large" color={Colors.styledColor} />
                <View style={styles.body}>
                    <Text style={styles['confirmed-text']}>Xác nhận</Text>
                    <Text>{`Nhập 6 ký tự được gửi tới số `}</Text>
                    <Text style={styles['phone-text']}>+84 363514804</Text>
                    <TextInput style={styles['phone-input']} autoFocus={true} onChangeText={onOtpCodeChanged}
                        clearButtonMode='always' keyboardType='numeric' placeholder='000000'
                        maxLength={6} textAlign='left' />
                    <CoundownTimer ref={coundownTimerRef} message='Thời gian còn lại' seconds={OTP_EXPIRED_SECONDS} onTimeout={onOtpCodeExpired} />
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
                        <Icon name="arrow-forward-outline" size={Variables.largeFontSize} color={Colors.white} />
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
            console.log(await onSignIn(otpCode.current));
        } catch (error) {
            showMessage({
                message: "Xác thực OTP",
                description: "Mã OTP không chính xác.",
                type: "error",
            });
        }
    }

    function resend() {
        setDisableResend(true);
        resetEnableResendTimer();
        coundownTimerRef.current.onReset();
        showMessage({
            message: "OTP",
            description: "Mã OTP đã được gửi lại",
            type: "success",
        });
    }

    function setupEnableResendTimer() {
        _openEnableResendTimer();
        return _closeEnableResendTimer;
    }

    function resetEnableResendTimer() {
        _closeEnableResendTimer();
        _openEnableResendTimer();
    }

    function _openEnableResendTimer() {
        enableResendIntervalRef.current = setInterval(() => {
            setDisableResend(false);
            _closeEnableResendTimer();
        }, ENABLE_RESEND_SECONDS * 1000);
    }

    function _closeEnableResendTimer() {
        clearInterval(enableResendIntervalRef.current);
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