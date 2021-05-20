import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {useSelector} from "react-redux";

import StartupNavigator from "./StartupNavigator";
import AppNavigator from '../navigation/AppNavigator';

const MainNavigator = () => {
    const isLoading = useSelector((state) => state.auth.isLoading);

    if(isLoading){
        return(
            <NavigationContainer>
                <StartupNavigator />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <AppNavigator/>
        </NavigationContainer>
    );
}

export default MainNavigator;
