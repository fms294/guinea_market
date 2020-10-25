
import React, { useState, useEffect } from 'react';
import LoginScreen from './app/screens/LoginScreen';
import { Image } from 'react-native';
import ListingEditScreen from './app/screens/ListingEditScreen';
import Button from './app/components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as Permission from 'expo-permissions';

import Screen from './app/components/Screen';

export default function App() {
  const [imageUri, setImageUri] = useState();
  
  const requestPermission = async() =>{
    const { granted }= await ImagePicker.requestCameraRollPermissionsAsync();
    if(!granted){
        alert("You need to enable permission to access the libray")
    }

  }
  useEffect(() =>{
    requestPermission();
  }, [])

  const selectImage = async () =>{
    try {
      const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.cancelled)
        setImageUri(result.uri);
    } catch (error) {
      console.log("Error reading an image", error)
    }
  }
  return(
    <Screen>
      <Button title="select Image" onPress={selectImage} />
      <Image source={{ uri: imageUri }} style={{ width:200, height:200}}/>
    </Screen>

  )

}

