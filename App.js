
import React, { useState, useEffect } from 'react';
import LoginScreen from './app/screens/LoginScreen';
import { Image } from 'react-native';
import ListingEditScreen from './app/screens/ListingEditScreen';
import Button from './app/components/Button';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import Screen from './app/components/Screen';
import ImageInput from './app/components/ImageInput';
import ImageInputList from './app/components/ImageInputList';

export default function App() {
  const [imageUris, setImageUris] = useState([]);

  const handleAdd = uri => {
    setImageUris([...imageUris, uri]);
  }

  const handleRemove = uri => {
    setImageUris(imageUris.filter(imageUri => imageUri !== uri ));
  }

  return(
    <Screen>
      <ImageInputList
        imageUris={imageUris} 
        onAddImage={ handleAdd}
        onRemoveImage={handleRemove}
      />
    </Screen>

  )

}

