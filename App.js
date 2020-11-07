
import React, { useState, useEffect } from 'react';
import {Text, Button } from 'react-native';

import Screen from './app/components/Screen';
import {createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer, TabActions } from '@react-navigation/native';
import {MaterialCommunityIcons } from '@expo/vector-icons';

import AuthNavigator from './app/navigation/AuthNavigator';
import AppNavigator from './app/navigation/AppNavigator';
import navigationTheme from './app/navigation/navigationTheme';

export default function App() {
  
  return(
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
   
  )

}

