const SpinnerManager = () => {
    const _defaultSpinner = {
        _id: undefined,
        showSpinner: () => { },
        hideSpinner: () => { }
    };

    const register = (_ref) => {
        if (_defaultSpinner._id) {
            return;
        }

        if ('_id' in _ref) {
            _defaultSpinner._id = _ref._id;
            _defaultSpinner.showSpinner = _ref.showSpinner;
            _defaultSpinner.hideSpinner = _ref.hideSpinner;
        }
    }

    const unregister = (_ref) => {
        if (_defaultSpinner._id === _ref._id) {
            _defaultSpinner._id = undefined;
            _defaultSpinner.showSpinner = undefined;
            _defaultSpinner.hideSpinner = undefined;
        }
    }

    const isReady = () => {
        return _defaultSpinner._id;
    }

    const getDefault = () => {
        return _defaultSpinner;
    }

    return {
        register,
        unregister,
        isReady,
        getDefault
    }
}

export default new SpinnerManager();