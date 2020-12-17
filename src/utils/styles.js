import Colors from './colors';

const Styles = {
    anchor: {
        fontWeight: 'bold',
        color: Colors.primaryColor,
        opacity: 0.8
    },
    'anchor--disabled': {
        color: Colors.grey,
    },
    cirle: {
        borderColor: Colors.primaryColor,
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    'icon-button': {
        width: 48,
        height: 48,
    },
    'icon-button--disabled': {
        backgroundColor: Colors.disabledColor
    },
    'text-error': {
        color: Colors.errorColor
    }
}

export default Styles;