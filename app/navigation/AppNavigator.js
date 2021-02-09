import React from 'react';
import {createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import AccountNavigator from './AccountNavigator';

import FeedNavigator from './FeedNavigator';
import ListingEditScreen from '../screens/ListingEditScreen';
import NewListingButton from './NewListingButton';
import colors from "../config/colors";
import { translate } from 'react-i18next';
//import useNotifications from '../hooks/useNotifications';

const Tab = createBottomTabNavigator();

const AppNavigator = (props) => {
    const {t} = props;
    //useNotifications();
    return (
        <Tab.Navigator
            tabBarOptions={{
                activeTintColor: colors.primary,
            }}
        >
            <Tab.Screen
                name={t("tab_nav:feed")}
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
                name={t("tab_nav:account")}
                component={AccountNavigator}
                options={{
                    tabBarIcon: ({ color, size}) =>
                    <Ionicons name="person-sharp" color={color} size={size}/>
                }}
                />
        </Tab.Navigator>
    );
}

export default translate(["tab_nav"], {wait: true})(AppNavigator);
