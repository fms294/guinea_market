import React, {useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity } from "react-native";

import Icon from "./Icon";
import AppText from "./Text";

const CategoryPickerItem = (props) => {
    const [value, setValue] = useState(null);
    //console.log("props...", props);
    return(
        <View>
            <View style={styles.container}>
                <AppText tyle={styles.label} onPress={props.onPress}>{props.item}</AppText>
            </View>
        </View>
        // <View style={styles.container}>
        //     <Icon backgroundColor={props.item.backgroundColor} name={props.item.icon} size={80}/>
        //     <AppText style={styles.label} onPress={props.onPress}>{props.item.label}</AppText>
        // </View>
        // <View>
        //     {props.map(res => {
        //         return (
        //             <View key={res.key} style={styles.container}>
        //                 <Text style={styles.radioText}>{res.text}</Text>
        //                 <TouchableOpacity
        //                     style={styles.radioCircle}
        //                     onPress={() => {
        //                         setValue(res.key);
        //                     }}>
        //                     {value === res.key && <View style={styles.selectedRb} />}
        //                 </TouchableOpacity>
        //             </View>
        //         );
        //     })}
        //     <Text> Selected: {props.item.item} </Text>
        // </View>
    );
}

const styles = StyleSheet.create({
    // container:{
    //     paddingHorizontal: 10,
    //     paddingVertical: 10,
    //     alignItems: "center",
    //     //width: "50%"
    // },
    label:{
        marginTop: 2,
        textAlign: "center"
    },
    container: {
        marginVertical: 10,
        //alignItems: 'center',
        //flexDirection: 'row',
        //justifyContent: 'space-between',
    },
    radioText: {
        marginRight: 35,
        fontSize: 20,
        color: '#000',
        fontWeight: '700'
    },
    radioCircle: {
        height: 30,
        width: 30,
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#3740ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedRb: {
        width: 15,
        height: 15,
        borderRadius: 50,
        backgroundColor: '#3740ff',
    },
    result: {
        marginTop: 20,
        color: 'white',
        fontWeight: '600',
        backgroundColor: '#F3FBFE',
    },
});

export default CategoryPickerItem;
