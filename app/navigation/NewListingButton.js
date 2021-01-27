import React from 'react';
import {View, StyleSheet} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import colors from '../config/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

function NewListingButton({ onPress}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.container}>
            <Ionicons
                name="add-circle"
                color={colors.primary}
                size={50}
            />
         </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container:{
        marginLeft: 3
    }
});

export default NewListingButton;
