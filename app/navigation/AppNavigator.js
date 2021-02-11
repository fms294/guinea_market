import React from 'react';
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import AccountNavigator from './AccountNavigator';

import FeedNavigator from './FeedNavigator';
import ListingEditScreen from '../screens/ListingEditScreen';
import NewListingButton from './NewListingButton';
import colors from "../config/colors";
//import useNotifications from '../hooks/useNotifications';

const Tab = createBottomTabNavigator();

const AppNavigator = (props) => {
    //useNotifications();
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: colors.primary,
                showLabel: false
            }}
        >
            <Tab.Screen
                name="FeedNavigator"
                component={FeedNavigator}
                options={{
                    tabBarIcon: ({ color, size}) =>
                    <Ionicons name="home-sharp" color={color} size={30}/>
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
                name="AccountNavigator"
                component={AccountNavigator}
                options={{
                    tabBarIcon: ({ color, size}) =>
                    <Ionicons name="person-sharp" color={color} size={30}/>
                }}
                />
        </Tab.Navigator>
    );
};

export default AppNavigator;
