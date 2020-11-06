import React, { useState, useEffect } from 'react';
import {FlatList, StyleSheet} from 'react-native';

import AppText from '../components/Text';
import Button from '../components/Button';
import Card from '../components/Card';
import colors from '../config/colors';
import listingsApi from '../api/listings';
import routes from '../navigation/routes';
import Screen from '../components/Screen';



function ListingsScreen({navigation}){
    const [listings, setListings]= useState([]);
    const [error, setError] = useState(false);

    useEffect(() =>{
        loadListing();
    }, [] );

    const loadListing = async() => {
        const response = await listingsApi.getListings();
        if(!response.ok) return setError(true);
        
        setError(false)
        setListings(response.data);
    }
    return (
        <Screen style={styles.screen}>
            {error && <> 
                <AppText>Couldn't retrieve the listings.</AppText>
                <Button title="Retry" onPress={loadListing}/>
            </>}
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

