import React from 'react';
import {FlatList, StyleSheet} from 'react-native';

import Screen from '../components/Screen';
import Card from '../components/Card';
import colors from '../config/colors';

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

function ListingsScreen(props){
    return (
        <Screen style={styles.screen}>
            <FlatList             
                data ={listings}
                keyExtractor={listing => listing.id.toString()}
                renderItem={({ item }) => 
                    <Card 
                        title={item.title}
                        subTitle={"$"+ item.price}
                        image={item.image}
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

