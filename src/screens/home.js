import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../utils/colors';
import Variables from '../utils/variables';
import Messages from './messages';
import Settings from './settings';

const Tab = createBottomTabNavigator();

const Home = () => {
    return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        switch (route.name) {
                            case 'Messages':
                                return <Ionicons name='mail-outline' size={size} color={color} />;
                            case 'Settings':
                                return <Ionicons name='settings-outline' size={size} color={color} />;
                        }
                    }
                })}
                backBehavior='none'
                keyboardHidesTabBar={true}
                tabBarOptions={{
                    activeTintColor: Colors.primaryColor,
                    inactiveTintColor: Colors.grey,
                    labelPosition: 'below-icon',
                    labelStyle: {
                        fontSize: Variables.smallFontSize
                    }
                }}
            >
                <Tab.Screen options={{ headerShown: false }} name="Messages" component={Messages} />
                <Tab.Screen options={{ headerShown: false }} name="Settings" component={Settings} />
            </Tab.Navigator>
    )
}

export default Home;