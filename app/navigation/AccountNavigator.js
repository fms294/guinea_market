import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AccountScreen from '../screens/AccountScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MyListingsScreen from "../screens/MyListingsScreen";
import ListingUpdateScreen from "../screens/ListingUpdateScreen";
import AboutScreen from "../screens/AboutScreen";
import SettingScreen from "../screens/SettingScreen";
import ChatScreen from "../screens/ChatScreen";
import OwnerProfileScreen from "../screens/OwnerProfileScreen";
import ImageBrowserScreen from "../components/UI/ImageBrowserScreen";
import colors from "../config/colors";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
    <Stack.Navigator
        screenOptions={{
                headerTintColor: colors.primary
        }}
    >
        <Stack.Screen name={"AccountScreen"} component={AccountScreen} />
        <Stack.Screen name={"OwnerProfileScreen"} component={OwnerProfileScreen} />
        <Stack.Screen name={"MyListingsScreen"} component={MyListingsScreen} />
        <Stack.Screen name={"ListingUpdateScreen"} component={ListingUpdateScreen} />
        <Stack.Screen name={"ImageBrowserScreen"} component={ImageBrowserScreen} />
        <Stack.Screen name={"MessagesScreen"} component={MessagesScreen} />
        <Stack.Screen name={"ChatScreen"} component={ChatScreen} />
        <Stack.Screen name={"AboutScreen"} component={AboutScreen} />
        <Stack.Screen name={"SettingScreen"} component={SettingScreen} />
        <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} options={{ headerShown: false}}/>
    </Stack.Navigator>
);

export default AccountNavigator;
