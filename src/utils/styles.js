import Colors from './colors';

const Styles = {
    anchor: {
        fontWeight: 'bold',
        color: Colors.styledColor,
        opacity: 0.8
    },
    'anchor--disabled': {
        color: Colors.grey,
    },
    cirle: {
        borderColor: Colors.styledColor,
        backgroundColor: Colors.styledColor,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    'icon-button': {
        width: 48,
        height: 48,
    }
}

export default Styles;