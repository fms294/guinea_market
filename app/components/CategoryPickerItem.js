import React from 'react';
import {View, StyleSheet } from "react-native";

import Icon from "./Icon";
import AppText from "./Text";

const CategoryPickerItem = (props) => {
    return(
        <View style={styles.container}>
            <Icon backgroundColor={props.item.backgroundColor} name={props.item.icon} size={80}/>
            <AppText style={styles.label} onPress={props.onPress}>{props.item.label}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: 10,
        paddingVertical: 10,
        alignItems: "center",
        width: "50%"
    },
    label:{
        marginTop: 2,
        textAlign: "center"
    }
});

export default CategoryPickerItem;
