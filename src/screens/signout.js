import React, { useContext, useEffect } from 'react';
import UserContext from '../context/user-context';
import { firebaseSignOut } from '../utils/firebase-utils';

const SignOut = () => {
    const { signOut } = useContext(UserContext);

    useEffect(() => {
        _signOut();
    }, [])

    return (
        <></>
    )

    async function _signOut() {
        try {
            await firebaseSignOut();
            signOut();
        } catch (error) {
            console.log(error);
        }
    }
}

export default SignOut;