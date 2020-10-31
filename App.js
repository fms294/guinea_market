
import React, { useState, useEffect } from 'react';
import {Text, Button } from 'react-native';

import Screen from './app/components/Screen';
import {createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {NavigationContainer, TabActions } from '@react-navigation/native';
import {MaterialCommunityIcons } from '@expo/vector-icons';
import AuthNavigator from './app/navigation/AuthNavigator';


// const Tweets = ({navigation}) =>(
//   <Screen>
//     <Text>Tweets</Text>
//     <Button 
//       title="View Tweet"
//       onPress={() => navigation.navigate("Tweets")}
//     />
//   </Screen>
// )
// const TweetDetails = () => (
//   <Screen>
//     <Text>Tweet Details</Text>
//   </Screen>
// )

// const Account = () => {
//   <Screen>
//     <Text>
//       Account
//     </Text>
//   </Screen>
// }
// const Stack = createStackNavigator();
// const Tab= createBottomTabNavigator();

// const TabNavigator = () => (
//   <Tab.Navigator
//     tabBarOptions={{ 
//       activateBackgroundColor: 'tomato',
//       activeTintColor: "white",
//       inactiveBackgroundColor: "#eee",
//       inactiveTintColor:"black"
//     }}
//   >
//     <Tab.Screen 
//       name="Feed" 
//       component={Tweets} 
//       options={{
//         tabBarIcon: ({size, color}) =>
//         (
//           <MaterialCommunityIcons name="home" size={size} color={color}/>
        
//         )
//       }}
//     />
//     <Tab.Screen name="Account" component={Account} />
//   </Tab.Navigator>
// )
// const Stacknavigator = () =>(
//   <Stack.Navigator>
//     <Stack.Screen name="TweetDetails" component={TweetDetails}/>
//     <Stack.Screen name="Tweets" component={Tweets}/>
//   </Stack.Navigator>
// )
export default function App() {
  
  return(
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
   
  )

}

