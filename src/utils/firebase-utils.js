import auth from '@react-native-firebase/auth';

export const firebasePhoneSignUp = (phone) => {
    return auth().signInWithPhoneNumber(phone);
}

export const firebasePhoneSignIn = (otpConfirmation, otpCode) => {
    return otpConfirmation.confirm(otpCode);
}

export const firebaseSignOut = () => {
    return auth().signOut();
}