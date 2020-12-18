import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import FlashMessage from "react-native-flash-message";
import Home from './screens/home';
import SignUp from './screens/sign-up';
import SplashScreen from './screens/splash';
import Spinner from './utils/spinner/spinner-utils';
import Variables from './utils/variables';
import UserContext from './context/user-context';
import AsyncStorage from '@react-native-community/async-storage';

_setupDefaultTextStyle();
const Stack = createStackNavigator();

const App = () => {
    const [settingUp, setSettingUp] = useState(true);
    const [user, setUser] = useState();

    useEffect(() => {
        setup();
    }, []);

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                {settingUp ? <SplashScreen /> :
                    <UserContext.Provider value={user}>
                        <NavigationContainer>
                            <Stack.Navigator>
                                {user ? (
                                    <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
                                ) : (
                                    <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} initialParams={{ onSignedIn }} />
                                )}
                            </Stack.Navigator>
                        </NavigationContainer>
                    </UserContext.Provider>}
            </SafeAreaView>
            <FlashMessage position="top" duration={3000}
                titleStyle={{ fontSize: Variables.defaultFontSize }} />
            <Spinner size="large" />
        </>
    );

    async function setup() {
        try {
            const user = await _retrieveUser();
            if (user) {
                setUser(JSON.parse(user));
            }
        } catch (error) {

        } finally {
            setSettingUp(false);
        }
    }

    async function onSignedIn({ user, isNewUser }) {
        try {
            await _storeUser(user);
            setUser(user);
        } catch (error) {

        }
    }

    function _storeUser(user) {
        return AsyncStorage.setItem('user', JSON.stringify(user));
    }

    function _retrieveUser() {
        return AsyncStorage.getItem('user');
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
