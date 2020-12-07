import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import auth from '@react-native-firebase/auth';

auth().languageCode = 'vi';
const Home = () => {
    console.log(auth().currentUser, auth().languageCode);
    return (
        <>
            {/* <Text>{auth().currentUser}</Text> */}
            <Text>{auth().languageCode}</Text>
        </>
    )
}

export default Home;