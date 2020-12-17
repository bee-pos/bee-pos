import React, { useLayoutEffect, useState } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import Colors from '../colors';
import SpinnerManager from './spinner-manager';

const _Spinner = ({ size }) => {
    const [show, setShow] = useState(false);

    useLayoutEffect(() => {
        const _id = _srid();
        SpinnerManager.register({
            _id,
            showSpinner: () => setShow(true),
            hideSpinner: () => setShow(false)
        });

        return () => SpinnerManager.unregister({ _id });
    }, []);

    return (
        <Spinner visible={show} size={size} color={Colors.primaryColor} />
    )

    function _srid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return `${s4()}-${s4()}-${s4()}`;
    }
}

export default _Spinner;

export function showSpinner() {
    if (SpinnerManager.isReady()) {
        SpinnerManager.getDefault().showSpinner();
    }
}

export function hideSpinner() {
    if (SpinnerManager.isReady()) {
        SpinnerManager.getDefault().hideSpinner();
    }
}
