import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import AppText from './Text';


const PickerItem = (props) => {
    console.log("Picket item", props);
    return (
        <TouchableOpacity onPress={props.onPress}>
            <AppText style={styles.text}>{props.item}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    text:{
        padding:8
    }
})
export default PickerItem;
