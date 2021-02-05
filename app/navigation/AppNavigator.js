import React from 'react';
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import AccountNavigator from './AccountNavigator';

import FeedNavigator from './FeedNavigator';
import ListingEditScreen from '../screens/ListingEditScreen';
import NewListingButton from './NewListingButton';
import routes from './routes';
import colors from "../config/colors";
//import useNotifications from '../hooks/useNotifications';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
    //useNotifications();
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: colors.primary,
            }}
        >
            <Tab.Screen
                name="Feed"
                component={FeedNavigator}
                options={{
                    tabBarIcon: ({ color, size}) =>
                    <Ionicons name="home-sharp" color={color} size={size}/>
                }}
                />
            <Tab.Screen
                name="ListingEditScreen"
                component={ListingEditScreen}
                options={({ navigation })=>({
                    tabBarButton: () => <NewListingButton onPress={() => navigation.navigate("ListingEditScreen") } />,
                })}

                />
            <Tab.Screen
                name="Account"
                component={AccountNavigator}
                options={{
                    tabBarIcon: ({ color, size}) =>
                    <Ionicons name="person-sharp" color={color} size={size}/>
                }}
                />
        </Tab.Navigator>
    );
}

export default AppNavigator;
