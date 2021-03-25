import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListingsScreen from '../screens/ListingsScreen';
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import UserProfileScreen from "../screens/UserProfileScreen";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();

const FeedNavigator = () => (
    <Stack.Navigator mode="modal" >{/*screenOptions={{ headerShown: false}}*/}
        <Stack.Screen name={"ListingsScreen"} component={ListingsScreen} />
        <Stack.Screen name={"ListingDetailsScreen"} component={ListingDetailsScreen} />
        <Stack.Screen name={"UserProfileScreen"} component={UserProfileScreen} />
        <Stack.Screen name={"ChatScreen"} component={ChatScreen} />
    </Stack.Navigator>
);

export default FeedNavigator;
