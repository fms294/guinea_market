import React from 'react';
import {FlatList, StyleSheet, ImagePropTypes} from 'react-native';

import Screen from '../components/Screen';
import Card from '../components/Card';
import colors from '../config/colors';
import routes from '../navigation/routes';

const listings = [
    {
        id:1,
        title: " Read Jacket for sale",
        price:100,
        image: require('../assets/jacket.jpeg')
    },
    {
        id:2,
        title: " Couch in great condition ",
        price:800,
        image: require('../assets/couch.jpeg')
    }

]

function ListingsScreen({navigation}){
    return (
        <Screen style={styles.screen}>
            <FlatList             
                data ={listings}
                keyExtractor={listing => listing.id.toString()}
                renderItem={({ item }) => 
                    <Card 
                        title={item.title}
                        subTitle={"GNF"+ item.price}
                        image={item.image}
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

