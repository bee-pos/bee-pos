import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import SignOutListItem from '../components/signout-list-item';

const Settings = ({ navigation }) => {
    return (
        <FlatList style={styles.container}
            keyExtractor={(item, _i) => _i.toString()}
            data={[
                {
                    component: <SignOutListItem signOut={signOut} />
                }
            ]}
            renderItem={renderItem}
        />
    )

    function renderItem({ item }) {
        return item.component;
    }

    function signOut() {
        navigation.navigate('SignOut');
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default Settings;