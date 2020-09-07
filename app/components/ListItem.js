import React from 'react';
import{View, StyleSheet , Image,TouchableHighlight } from 'react-native';
import AppText from '../components/AppText';

import colors from "../config/colors";

function ListItme({title, subTitle, image, onPress}){
    return(
        <TouchableHighlight 
            underlayColor={colors.light}
            onPress={onPress}
        >
            <View style={styles.container}>
                <Image style={styles.image} source={image} />
                <View>
                    <AppText style={styles.title}>{title}</AppText>
                    <AppText style={styles.subTitle}>{subTitle}</AppText>
                </View>
            </View>
        </TouchableHighlight>
    );
}


const styles = StyleSheet.create({
    container:{
        flexDirection:"row", 
        padding:15
    },
    image:{
        width:80,
        height:80,
        borderRadius:100,
        marginRight: 15
    },
    title:{
        fontWeight:"bold",
        

    },
    subTitle:{
        color:colors.medium
    }

})
export default ListItme;