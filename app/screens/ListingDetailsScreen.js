import React from 'react';
import { View, Image, StyleSheet} from 'react-native';
import AppText from '../components/Text';

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';

function ListingDetailsScreen(props){
    return (
        <View>
            <Image style={styles.image} source={require('../assets/jacket.jpeg')} />
            <View style={styles.detailContainer}>
                <AppText style={styles.title}>Red Jacket for sale</AppText>
                <AppText style={styles.price}>$100</AppText>
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