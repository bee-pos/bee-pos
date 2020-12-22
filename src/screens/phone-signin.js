import { Formik } from 'formik';
import React, { useContext, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import CoundownTimer from '../components/countdown-timer';
import UserContext from '../context/user-context';
import Colors from '../utils/colors';
import { firebasePhoneSignIn, firebasePhoneSignUp } from '../utils/firebase-utils';
import { hideSpinner, showSpinner } from '../utils/spinner/spinner-utils';
import Styles from '../utils/styles';
import Variables from '../utils/variables';

const initialValues = { otpCode: '' };
const validationSchema = yup.object().shape({
    otpCode: yup.string()
        .min(6, 'Mã OTP không chính xác')
        .required('Bạn chưa nhập vào mã OTP')
});

const PhoneSignin = ({ navigation, route: { params: { dialPhone } } }) => {
    const coundownTimerRef = useRef();
    const { signUp, getOtp, getOtpCountdownSeconds, signIn } = useContext(UserContext);

    const [expiredOtp, setExpiredOtp] = useState(false);
    const [countdownSeconds, setCountdownSeconds] = useState(getOtpCountdownSeconds());


    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={signInByOtpCode}
            validateOnBlur={false} validateOnChange={false}>
            {({ handleChange, handleSubmit, errors, isValidating, isSubmitting }) => (
                <View style={styles.container}>
                    <View style={styles.body}>
                        <Text style={styles['confirmed-text']}>Xác nhận</Text>
                        <Text>{`Nhập 6 ký tự được gửi tới số `}</Text>
                        <Text style={styles['dial-phone-text']}>{dialPhone}</Text>
                        <View style={styles['otp-code']}>
                            <TextInput style={styles['otp-code__input']}
                                onChangeText={handleChange('otpCode')}
                                autoFocus={true} clearButtonMode='always'
                                keyboardType='numeric' placeholder='000000'
                                maxLength={6} textAlign='left' />
                        </View>
                        <CoundownTimer ref={coundownTimerRef} message='Thời gian còn lại'
                            seconds={countdownSeconds} onTimeout={onOtpCodeExpired} />
                    </View>
                    <View style={styles.footer}>
                        <View>
                            <Text>Bạn không nhận được mã kích hoạt?</Text>
                            <TouchableOpacity disabled={!expiredOtp} onPress={resendOtpCode} >
                                <Text style={[styles['re-send-btn'], expiredOtp ? '' : styles['re-send-btn--disabled']]} >
                                    Gửi lại mã kích hoạt
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={[Styles.cirle, Styles['icon-button'],
                        (expiredOtp || isValidating || isSubmitting) ? Styles['icon-button--disabled'] : {}]}
                            onPress={handleSubmit} disabled={expiredOtp || isValidating || isSubmitting}>
                            <Ionicons name='arrow-forward-outline' size={Variables.mediumFontSize} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </Formik>
    )

    function onOtpCodeExpired() {
        setExpiredOtp(true);
    }

    async function signInByOtpCode({ otpCode }) {
        showSpinner();

        try {
            const { additionalUserInfo: { isNewUser }, user } = await firebasePhoneSignIn(getOtp(), otpCode);
            signIn(user, isNewUser);
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
        showSpinner();

        try {
            const otpConfirmation = await firebasePhoneSignUp(dialPhone);
            signUp(dialPhone, otpConfirmation);

            coundownTimerRef.current.reset();
            setCountdownSeconds(getOtpCountdownSeconds());

            setExpiredOtp(false);
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

    function onBackToSignUp() {
        navigation.navigate('PhoneSignup', { dialPhone })
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
    'dial-phone-text': {
        fontSize: Variables.mediumFontSize,
        color: Colors.primaryColor
    },
    'otp-code': {
        marginTop: 20,
        marginBottom: 20,
    },
    'otp-code__input': {
        color: Colors.grey,
        fontSize: Variables.mediumFontSize,
        fontWeight: 'bold',
        paddingLeft: 0,
        paddingTop: 0,
        paddingLeft: 0,
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

export default PhoneSignin;