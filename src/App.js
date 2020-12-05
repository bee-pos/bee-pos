import React, { useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text } from 'react-native';
import SplashScreen from './screens/splash';
import Variables from './utils/variables';

_setupDefaultTextStyle();

const App = () => {
    return (
        <>
            <StatusBar translucent={true} barStyle="light-content" />
            <SafeAreaView style={styles.container}>
                <SplashScreen />
            </SafeAreaView>
        </>
    );
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
