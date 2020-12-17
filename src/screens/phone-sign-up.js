import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { showMessage } from "react-native-flash-message";
import { getCountry } from "react-native-localize";
import Icon from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import HeaderLogo from '../../assets/header-logo.png';
import Colors from '../utils/colors';
import countryDialCodes from '../utils/country-dial-codes';
import { firebasePhoneSignUp } from '../utils/firebase-utils';
import { hideSpinner, showSpinner } from '../utils/spinner/spinner-utils';
import Styles from '../utils/styles';
import Variables from '../utils/variables';

const PhoneSignUp = ({ onSignedUp }) => {
    const DEFAULT_COUNTRY_DIAL_CODE = {
        name: "Vietnam",
        dialCode: "+84",
        countryCode: "VN",
        flag: require('../../assets/flags/vn.png')
    };

    const initialValues = { phone: '' };
    const validationSchema = yup.object().shape({
        phone: yup.string().required('Bạn chưa nhập vào số điện thoại')
    });

    const [countryDialCode, setDialCode] = useState(DEFAULT_COUNTRY_DIAL_CODE);

    useEffect(() => {
        const countryCode = getCountry();
        const countryDialCode = countryDialCodes.find(code => code.countryCode === countryCode);
        if (countryDialCode) {
            setDialCode(countryDialCode);
        }
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={HeaderLogo} height={60} />
            </View>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={signUpWithPhoneNumber}>
                {({ handleChange, handleSubmit, errors, isValidating, isSubmitting }) => (
                    <>
                        <View style={styles.body}>
                            <Text style={styles['welcome-text']}>Xin chào</Text>
                            <Text style={styles['sign-in-text']}>Bạn đã sẵn sàng chưa, nhập số điện thoại để đăng nhập</Text>
                            <View style={styles['phone-input-container']}>
                                <Image source={countryDialCode.flag} />
                                <Text style={styles['phone-input-container__prefix']}>{countryDialCode.dialCode}</Text>
                                <TextInput style={styles['phone-input-container__input']}
                                    onChangeText={handleChange('phone')}
                                    maxLength={11} autoFocus={true} clearButtonMode='always'
                                    keyboardType='numeric' placeholder='Số điện thoại' />
                            </View>
                            {errors.phone && <Text style={Styles['text-error']}>{errors.phone}</Text>}
                        </View>
                        <View style={styles.footer}>
                            <TouchableOpacity style={[Styles.cirle, Styles['icon-button']]}
                                onPress={handleSubmit} disabled={isValidating || isSubmitting} >
                                <Icon name='arrow-forward-outline' size={Variables.largeFontSize} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )

    async function signUpWithPhoneNumber({ phone }) {
        showSpinner();

        const dialPhone = `${countryDialCode.dialCode}${phone}`;
        try {
            const otpAuthentication = await firebasePhoneSignUp(dialPhone);
            onSignedUp(dialPhone, otpAuthentication);
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