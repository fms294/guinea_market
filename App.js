import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-community/async-storage";
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
import * as Analytics from "expo-firebase-analytics";

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
            //alert('Must use physical device for Push Notifications');
        }
    }

    useEffect(() => {
        Analytics.setDebugModeEnabled(true);
    });

    useEffect(() => {
        getPushNotificationPermissions();
    });

    return(
        <Provider store={store}>
            <ReloadApp />
        </Provider>
    );
}
