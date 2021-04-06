import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListingEditScreen from "../screens/ListingEditScreen";
import ImageBrowserScreen from "../components/UI/ImageBrowserScreen";
import colors from "../config/colors";

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
    </Stack.Navigator>
);

export default ListingEditNavigator;
