import React, { useState, useEffect } from 'react';
import {FlatList, StyleSheet} from 'react-native';

import Screen from '../components/Screen';
import Card from '../components/Card';
import colors from '../config/colors';
import listingsApi from '../api/listings';
import routes from '../navigation/routes';


function ListingsScreen({navigation}){
    const [listings, setListings]= useState([]);

    useEffect(() =>{
        loadListing();
    }, [] );

    const loadListing = async() => {
        const response = await listingsApi.getListings();
        setListings(response.data);
    }
    return (
        <Screen style={styles.screen}>
            <FlatList             
                data ={listings}
                keyExtractor={listing => listing.id.toString()}
                renderItem={({ item }) => 
                    <Card 
                        title={item.title}
                        subTitle={"GNF"+ item.price}
                        imageUrl={item.images[0].url}
                        onPress={() => navigation.navigate(routes.LISTING_DETAILS, item) }
                    />
                }
            />
        </Screen>

    )
}

const styles = StyleSheet.create({
    screen:{
        padding:20, 
        backgroundColor: colors.light
    }

})

export default ListingsScreen;

