
import React, { useState, useEffect } from 'react';

import {NavigationContainer, TabActions } from '@react-navigation/native';


import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';
import OfflineNotice from './app/components/offlineNotice';

export default function App() {
  
  return(
    <>
      <OfflineNotice />
      <NavigationContainer theme={navigationTheme}>
        <AppNavigator />
      </NavigationContainer>
    </>
   
  )

}

