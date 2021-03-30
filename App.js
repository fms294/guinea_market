import React, { useState, useEffect } from 'react';
// import {NavigationContainer} from '@react-navigation/native';
import { AppLoading } from 'expo';
// import navigationTheme from './app/navigation/navigationTheme';
// import OfflineNotice from './app/components/offlineNotice';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import {View,Text, ActivityIndicator, Alert} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
// import AuthContext from './app/auth/context';
// import authStorage from './app/auth/storage';
// import {navigationRef} from './app/navigation/rootNavigation';
import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import ReduxThunk from "redux-thunk";
import { translate } from "react-i18next";
import i18n from "./app/i18n";

import authReducers from "./app/store/reducers/auth";
import listingReducers from "./app/store/reducers/listing";
import localizationReducers from "./app/store/reducers/localization";
import MainNavigator from "./app/navigation/MainNavigator";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";


const rootReducer = combineReducers({
    auth: authReducers,
    listing: listingReducers,
    localization: localizationReducers,
});

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(ReduxThunk))
)

const WrappedStack = ({t}) => {
    return <MainNavigator screenProps={{t}} />;
}

const ReloadApp = translate('common', {
    bindI18n: 'languageChanged',
    bindStore: false,
})(WrappedStack);

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export default function App() {

    const getPushNotificationPermissions = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert('Failed to get push token for push notification!');
                return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            console.log(token);
            AsyncStorage.setItem(
                'notification_token',
                JSON.stringify({
                    token: token
                }),
            );
            // this.setState({ expoPushToken: token });
        } else {
            alert('Must use physical device for Push Notifications');
        }
    }

    // const handleNotificationAlert = (notification, type) => {
    //     Alert.alert(JSON.stringify(notification));
    // }

    useEffect(() => {
        getPushNotificationPermissions();
    });

    return(
        <Provider store={store}>
            <ReloadApp />
        </Provider>
    );
}
    // }else{
    //     return(
    //         <Provider store={store}>
    //             <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //                 <Text>Loading...</Text>
    //             </View>
    //         </Provider>
    //     );
    // }

// const [user, setUser] = useState();
// const [isReady, setIsReady] = useState();
//
// const restoreUser = async() =>{
//   const user = await authStorage.getUser();
//   if(user) setUser(user);
// };
//
// if(!isReady)
//   return (
//     <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)}/>
//   )
    // <AuthContext.Provider value={{user, setUser }}>
    //   <OfflineNotice />
    //   <NavigationContainer ref={navigationRef} theme={navigationTheme}>
    //     { user ? <AppNavigator />: <AuthNavigator />}
    //   </NavigationContainer>
    // </AuthContext.Provider>
      // <View><Text>Hello</Text></View>


// if(loading){
//     return(
//         <View style={{
//             flex: 1,
//             justifyContent: 'center',
//             alignItems: 'center',
//         }}>
//             <ActivityIndicator size="large" color={colors.primary} />
//         </View>
//     );
// }
