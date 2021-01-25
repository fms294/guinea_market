import React, { useState, useEffect } from 'react';
// import {NavigationContainer} from '@react-navigation/native';
import { AppLoading } from 'expo';
// import navigationTheme from './app/navigation/navigationTheme';
// import OfflineNotice from './app/components/offlineNotice';
import AppNavigator from './app/navigation/AppNavigator';
import AuthNavigator from './app/navigation/AuthNavigator';
import {View,Text, ActivityIndicator} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";
// import AuthContext from './app/auth/context';
// import authStorage from './app/auth/storage';
// import {navigationRef} from './app/navigation/rootNavigation';
import {createStore, combineReducers, compose, applyMiddleware} from "redux";
import {Provider} from "react-redux";
import ReduxThunk from "redux-thunk";

import authReducers from "./app/store/reducers/auth";
import listingReducers from "./app/store/reducers/listing";
import MainNavigator from "./app/navigation/MainNavigator";

const rootReducer = combineReducers({
    auth: authReducers,
    listing: listingReducers
});

let composeEnhancers = compose;

if (__DEV__) {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(ReduxThunk))
)

export default function App() {
        return(
            <Provider store={store}>
                <MainNavigator/>
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
