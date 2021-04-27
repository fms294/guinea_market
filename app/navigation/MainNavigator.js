import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {useSelector} from "react-redux";

import StartupNavigator from "./StartupNavigator";
import AppNavigator from '../navigation/AppNavigator';
import AuthNavigator from '../navigation/AuthNavigator';

const MainNavigator = () => {
    const token = useSelector((state) => state.auth.token);
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

    // if(token === null){
    //     return(
    //         <NavigationContainer>
    //             <AuthNavigator />
    //         </NavigationContainer>
    //     );
    // }else {
    //     return(
    //         <NavigationContainer>
    //             <AppNavigator/>
    //         </NavigationContainer>
    //     );
    // }
}

export default MainNavigator;
