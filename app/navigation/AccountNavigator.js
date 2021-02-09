import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from '../screens/AccountScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MyListingsScreen from "../screens/MyListingsScreen";
import AboutScreen from "../screens/AboutScreen";
import SettingScreen from "../screens/SettingScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen name={"AccountScreen"} component={AccountScreen} />
        <Stack.Screen name={"MyListingsScreen"} component={MyListingsScreen} />
        <Stack.Screen name={"MessagesScreen"} component={MessagesScreen} />
        <Stack.Screen name={"AboutScreen"} component={AboutScreen} />
        <Stack.Screen name={"SettingScreen"} component={SettingScreen} />
    </Stack.Navigator>
);

export default AccountNavigator;
