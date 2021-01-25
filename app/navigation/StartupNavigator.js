import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import StartupScreen from "../screens/StartupScreen";

const Stack = createStackNavigator();

const StartupNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="StartupScreen"
            component={StartupScreen}
            options={{ headerShown: false}}
        />
    </Stack.Navigator>
)

export default StartupNavigator;
