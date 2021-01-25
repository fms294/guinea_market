import React from 'react';
import { View,  StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {Image} from 'react-native-expo-image-cache';

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
//import ContactSellerForm from '../components/ContactSellerForm';
import Text from '../components/Text';

const ListingDetailsScreen = (props) => {
    const listing = props.route.params.listing;
    return (
        <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
        >
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
                        image={{uri: listing.images[0].url}}
                        title="Fanta"
                        subTitle="5 Listings"
                    />
                </View>
                {/*<ContactSellerForm listing={listing} />*/}
            </View>
        </KeyboardAvoidingView>
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
