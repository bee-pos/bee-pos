import { createContext } from 'react';

const UserContext = createContext({
    user: undefined,
    signUp: (dialPhone, otp) => { },
    getSignedUpDialPhone: () => { },
    getOtp: () => { },
    getOtpCountdownSeconds: () => { },
    isOtpExpired: () => { },
    signIn: (user, isNewUser) => { },
    signOut: () => { }
});

export default UserContext;