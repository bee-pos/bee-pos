import { createContext } from 'react';

const UserContext = createContext({
    user: undefined,
    signUp: () => {},
    getOtp: () => {},
    getCurrentOtpSeconds: () => {},
    isOtpExpired: () => {},
    signIn: () => {},
    signOut: () => {}
});

export default UserContext;