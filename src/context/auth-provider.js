import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import UserContext from './user-context';

const OTP_EXPIRED_SECONDS = 60;

const AuthProvider = ({ children, onSignedIn, onSignedOut }) => {
    const signedUpDialPhone = useRef();
    const signedUpTime = useRef(0);
    const signedUpOtp = useRef();

    const [currentUser, setCurrentUser] = useState();

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
        signedUpDialPhone.current = dialPhone;
        signedUpTime.current = new Date().getTime();
        signedUpOtp.current = otp;
    }

    const getSignedUpDialPhone = () => {
        return signedUpDialPhone.current;
    }

    const getOtp = () => {
        return signedUpOtp.current;
    }

    const signIn = async (user, isNewUser) => {
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

    const getOtpCountdownSeconds = () => {
        const countdownSeconds = OTP_EXPIRED_SECONDS - parseInt((new Date().getTime() - signedUpTime.current) / 1000);
        return countdownSeconds <= 0 ? 0 : countdownSeconds;
    }

    const isOtpExpired = () => {
        return getOtpCountdownSeconds() === 0;
    }

    return (
        <UserContext.Provider value={{
            user: currentUser, signUp, getSignedUpDialPhone, getOtp,
            getOtpCountdownSeconds, isOtpExpired, signIn, signOut
        }}>
            {children}
        </UserContext.Provider>
    )

    function _storeUser(user) {
        return AsyncStorage.setItem('signedInUser', JSON.stringify(user));
    }

    function _retrieveUser() {
        return AsyncStorage.getItem('signedInUser');
    }
}

export default AuthProvider;