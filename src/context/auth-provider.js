import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import UserContext from './user-context';

const AuthProvider = ({ children, onSignedIn, onSignedOut }) => {

    const [currentUser, setCurrentUser] = useState();
    const otpConfirm = useRef();

    useEffect(() => {
        const isSignedIn = async () => {
            try {
                const user = await _retrieveUser();
                if (user) {
                    setCurrentUser(JSON.parse(user));
                    onSignedIn()
                }
            } catch (error) {
                console.log(error);
            }
        }

        isSignedIn();
    }, []);

    const signUp = (dialPhone, otp) => {
        otpConfirm.current = otp;
    }

    const getOtp = () => {
        return otpConfirm.current;
    }

    const signIn = async ({ user, isNewUser }) => {
        try {
            await _storeUser(user);
            setCurrentUser(user);
            onSignedIn();
        } catch (error) {
            console.log(error);
        }
    }

    const signOut = async () => {
        try {
            await AsyncStorage.clear(() => setCurrentUser());
            onSignedOut();
        } catch (error) {

        }
    }

    return (
        <UserContext.Provider value={{ user: currentUser, signUp, getOtp, signIn, signOut }}>
            {children}
        </UserContext.Provider>
    )

    function _storeUser(user) {
        return AsyncStorage.setItem('user', JSON.stringify(user));
    }

    function _retrieveUser() {
        return AsyncStorage.getItem('user');
    }
}

export default AuthProvider;