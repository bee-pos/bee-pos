import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import FlashMessage from "react-native-flash-message";
import Home from './screens/home';
import PhoneSignIn from './screens/phone-sign-in';
import PhoneSignUp from './screens/phone-sign-up';
import SplashScreen from './screens/splash';
import Colors from './utils/colors';
import Variables from './utils/variables';

_setupDefaultTextStyle();
const Stack = createStackNavigator();

const App = () => {
    const OTPPhoneSignUp = (props) => <PhoneSignUp {...props} onSignedUp={onSignedUp} />
    const OTPPhoneSignIn = (props) => <PhoneSignIn {...props} onSignedIn={onSignedIn} otpAuthentication={otpAuthentication} />

    const navigationRef = useRef();

    const [settingUp, setSettingUp] = useState(true);
    const [otpAuthentication, setOtpAuthentication] = useState();
    const [user, setUser] = useState();

    setup();

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {settingUp ? <SplashScreen /> :
                    <NavigationContainer ref={navigationRef}>
                        <Stack.Navigator>
                            {user ? (
                                <>
                                    <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
                                </>
                            ) : (
                                <>
                                    <Stack.Screen options={{ headerShown: false }} name="PhoneSignUp" component={OTPPhoneSignUp} />
                                    <Stack.Screen options={{ title: '' }} name="PhoneSignIn" component={OTPPhoneSignIn} />
                                </>
                            )}
                        </Stack.Navigator>
                    </NavigationContainer>}
            </SafeAreaView>
            <FlashMessage position="top" duration={3000} titleStyle={{ fontWeight: 'bold' }} />
        </>
    );

    function setup() {
        setTimeout(() => {
            setSettingUp(false);
        }, 3000);
    }

    function onSignedUp(phone, otpAuthentication) {
        setOtpAuthentication(otpAuthentication);
        navigationRef.current?.navigate('PhoneSignIn', { phone });
    }

    function onSignedIn({ user, isNewUser }) {
        setUser(user);
    }
};

function _setupDefaultTextStyle() {
    const originalRender = Text.render;
    Text.render = function (...args) {
        const origin = originalRender.call(this, ...args);
        return React.cloneElement(origin, {
            style: [{ fontSize: Variables.defaultFontSize }, origin.props.style]
        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default App;
