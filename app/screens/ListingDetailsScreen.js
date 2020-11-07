import React from 'react';
import { View,  StyleSheet} from 'react-native';
import {Image} from 'react-native-expo-image-cache';

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Text from '../components/Text';

function ListingDetailsScreen({route}){
    const listing = route.params;
    return (
        <View>
            <Image 
                style={styles.image} 
                preview={{ uri: listing.images[0].thumbnailUrl }} 
                tint="light"
                uri={listing.images[0].url} 
            />
            <View style={styles.detailContainer}>
                <Text style={styles.title}>{listing.title}</Text>
                <Text style={styles.price}>GNF {listing.price}</Text>
                <View style={styles.userContainer}>
                    <ListItem 
                        image={require("../assets/fanta.jpeg")}
                        title="Fanta"
                        subTitle="5 Listings"
                    />
                </View>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    detailContainer:{
        padding:20
    },
    image:{
        width:"100%",
        height:300
    },
    price:{
        color: colors.secondary,
        fontWeight:'bold',
        fontSize:20,
        marginVertical:10
    },
    userContainer:{
        marginVertical:50
    },
    title:{
        fontSize:24,
        fontWeight:"500"
    },
    
})


export default ListingDetailsScreen;