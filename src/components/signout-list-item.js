import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ListItem } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Variables from '../utils/variables';

const SignOutListItem = ({ signOut }) => {
    return (
        <ListItem bottomDivider onPress={signOut} >
            <ListItem.Content style={styles.content}>
                <Ionicons name='log-out-outline' size={Variables.largeFontSize} style={styles['content__icon']} />
                <ListItem.Title style={styles['content-title']}>
                    <Text>Đăng xuất</Text>
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron color="white" />
        </ListItem>
    )
}

const styles = StyleSheet.create({
    content: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    'content__icon': {
        marginRight: 5
    },
    'content-title': {
        flexDirection: 'column',
        marginRight: 5
    }
})

export default SignOutListItem;