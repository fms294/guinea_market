
import React, { useState, useEffect } from 'react';
import NetInfo, {useNetInfo, NetInfoCellularGeneration} from '@react-native-community/netinfo';
import { Button , AsyncStorage} from 'react-native';

export default function App() {
  const demo = async() => {
    try {
      await AsyncStorage.setItem('person', JSON.stringify({id:1}))
      const value = await AsyncStorage.getItem('person');
      JSON.parse(value);
      console.log(person)

    } catch (error) {
      console.log(error);
    }

  }
  demo()

  return(
    <>
    </>
  )

}

