
import React, { useState, useEffect } from 'react';

import {NavigationContainer} from '@react-navigation/native';


import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import OfflineNotice from './app/components/offlineNotice';
import AuthNavigator from './app/navigation/AuthNavigator';
import AuthContext from './app/auth/context';
import authStorage from './app/auth/storage';
import { AppLoading } from 'expo';

export default function App() {
  const [user, setUser] = useState();
  const [isReady, setIsReady] = useState();

  const restoreUser = async() =>{
    const user = await authStorage.getUser();
    if(user) setUser(user);
  };

  if(!isReady)
    return (
      <AppLoading startAsync={restoreUser} onFinish={() => setIsReady(true)}/>
    )
  
  return(
    <AuthContext.Provider value={{user, setUser }}>
      <OfflineNotice />
      <NavigationContainer theme={navigationTheme}>
        { user ? <AppNavigator />: <AuthNavigator />}
      </NavigationContainer>
    </AuthContext.Provider>
   
  )

}

