import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import FlashMessage from "react-native-flash-message";
import AuthProvider from './context/auth-provider';
import Home from './screens/home';
import PhoneSignin from './screens/phone-signin';
import PhoneSignup from './screens/phone-signup';
import SplashScreen from './screens/splash';
import Signout from './screens/signout';
import Colors from './utils/colors';
import Spinner from './utils/spinner/spinner-utils';
import Variables from './utils/variables';

_setupDefaultTextStyle();
const Stack = createStackNavigator();

const App = () => {
    const [settingUp, setSettingUp] = useState(true);
    const [signedIn, setSignedIn] = useState(false);

    const navigationRef = useRef();

    useEffect(() => {
        setup();
    }, []);

    return (
        <>
            <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                {settingUp ? <SplashScreen /> :
                    <NavigationContainer ref={navigationRef} >
                        <AuthProvider onSignedIn={onSignedIn} onSignedOut={onSignedOut}>
                            <Stack.Navigator>
                                {signedIn ? (
                                    <>
                                        <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
                                        <Stack.Screen options={{ headerShown: false }} name="SignOut" component={Signout} />
                                    </>
                                ) : (
                                        <>
                                            <Stack.Screen options={{ headerShown: false }} name="PhoneSignup" component={PhoneSignup} />
                                            <Stack.Screen options={{ title: '' }} name="PhoneSignin" component={PhoneSignin} />
                                        </>
                                    )}
                            </Stack.Navigator>
                        </AuthProvider>
                    </NavigationContainer>
                }
            </SafeAreaView>
            <FlashMessage position="top" duration={3000}
                titleStyle={{ fontSize: Variables.defaultFontSize }} />
            <Spinner size="large" />
        </>
    );

    async function setup() {
        setTimeout(() => setSettingUp(false), 3000);
    }

    function onSignedIn() {
        setSignedIn(true);
    }

    function onSignedOut() {
        setSignedIn(false);
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
