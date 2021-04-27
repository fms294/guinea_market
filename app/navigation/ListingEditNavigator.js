import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListingEditScreen from "../screens/ListingEditScreen";
import ImageBrowserScreen from "../components/UI/ImageBrowserScreen";
import colors from "../config/colors";
import WelcomeScreen from "../screens/WelcomeScreen";

const Stack = createStackNavigator();

const ListingEditNavigator = () => (
    <Stack.Navigator
        mode="modal"
        screenOptions={{
            headerTintColor: colors.primary
        }}
    >
        <Stack.Screen name={"ListingEditScreen"} component={ListingEditScreen} />
        <Stack.Screen name={"ImageBrowserScreen"} component={ImageBrowserScreen} />
        <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} options={{ headerShown: false}}/>
    </Stack.Navigator>
);

export default ListingEditNavigator;
