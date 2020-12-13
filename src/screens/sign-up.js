import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import PhoneSignIn from './phone-sign-in';
import PhoneSignUp from './phone-sign-up';

const Stack = createStackNavigator();

const SignUp = ({ route: { params: { onSignedIn } } }) => {
    const OTPPhoneSignUp = (props) => <PhoneSignUp {...props} onSignedUp={onSignedUp} />
    const OTPPhoneSignIn = (props) => <PhoneSignIn {...props} onSignedIn={onSignedIn} otpAuthentication={otpAuthentication} />

    const navigationRef = useRef();
    const [otpAuthentication, setOtpAuthentication] = useState();

    return (
        <>
            <NavigationContainer ref={navigationRef} independent={true}>
                <Stack.Navigator>
                    <Stack.Screen options={{ headerShown: false }} name="PhoneSignUp" component={OTPPhoneSignUp} />
                    <Stack.Screen options={{ title: '' }} name="PhoneSignIn" component={OTPPhoneSignIn} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )

    function onSignedUp(phone, otpAuthentication) {
        setOtpAuthentication(otpAuthentication);
        navigationRef.current.navigate('PhoneSignIn', { phone });
    }
}

export default SignUp;