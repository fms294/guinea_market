import React,{useEffect} from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ListingsScreen from '../screens/ListingsScreen';
import ListingDetailsScreen from '../screens/ListingDetailsScreen';
import UserProfileScreen from "../screens/UserProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import colors from "../config/colors";
import WelcomeScreen from "../screens/WelcomeScreen";
import {useDispatch} from "react-redux";
import {refreshTab} from "../store/actions/listing";

const Stack = createStackNavigator();

const FeedNavigator = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('tabPress', (e) => {
            // Prevent default behavior

            e.preventDefault();
            console.log("insideee")
            dispatch(refreshTab())
            // Do something manually
            // ...
        });

        return unsubscribe;
    }, [props.navigation]);
    return (
        <Stack.Navigator
            mode="modal"
            screenOptions={{
                headerTintColor: colors.primary
            }}
        >
            <Stack.Screen name={"ListingsScreen"} component={ListingsScreen}/>
            <Stack.Screen name={"ListingDetailsScreen"} component={ListingDetailsScreen}/>
            <Stack.Screen name={"WelcomeScreen"} component={WelcomeScreen} options={{headerShown: false}}/>
            <Stack.Screen name={"UserProfileScreen"} component={UserProfileScreen}/>
            <Stack.Screen name={"ChatScreen"} component={ChatScreen}/>
        </Stack.Navigator>
    );
}

export default FeedNavigator;
