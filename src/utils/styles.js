import Colors from './colors';
import Variables from './variables';

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
        fontSize: Variables.smallFontSize,
        color: Colors.errorColor
    }
}

export default Styles;