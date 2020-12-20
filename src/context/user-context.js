import { createContext } from 'react';

const UserContext = createContext({
    user: undefined,
    signUp: () => {},
    getOtp: () => {},
    signIn: () => {},
    signOut: () => {}
});

export default UserContext;