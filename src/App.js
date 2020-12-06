import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import FlashMessage from "react-native-flash-message";
import PhoneSignIn from './screens/phone-sign-in';
import PhoneSignUp from './screens/phone-sign-up';
import SplashScreen from './screens/splash';
import Colors from './utils/colors';
import Variables from './utils/variables';

_setupDefaultTextStyle();
const Stack = createStackNavigator();

const App = () => {
    const PropsPhoneSignUp = (props) => <PhoneSignUp {...props} onSignUp={onSignUp} />
    const PropsPhoneSignIn = (props) => <PhoneSignIn {...props} onSignIn={onSignIn} />

    const authentication = useRef();
    const [settingUp, setSettingUp] = useState(true);

    setup();

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {settingUp ? <SplashScreen /> :
                    <NavigationContainer>
                        <Stack.Navigator>
                            <Stack.Screen options={{ headerShown: false }} name="PhoneSignUp" component={PropsPhoneSignUp} />
                            <Stack.Screen options={{ title: '' }} name="PhoneSignIn" component={PropsPhoneSignIn} />
                        </Stack.Navigator>
                    </NavigationContainer>}
            </SafeAreaView>
            <FlashMessage position="top" style={styles['flash-message']} />
        </>
    );

    function setup() {
        setTimeout(() => {
            setSettingUp(false);
        }, 3000);
    }

    function onSignUp(phone) {
        return auth().signInWithPhoneNumber(phone)
            .then((otpAuthentication) => {
                authentication.current = otpAuthentication;
                return true;
            })
            .catch((error) => false);
    }

    function onSignIn(code) {
        return authentication.current.confirm(code);
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
    },
    'flash-message': {
        backgroundColor: Colors.styledColor
    }
});

export default App;
