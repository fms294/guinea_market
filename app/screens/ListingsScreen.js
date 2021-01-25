import React, { useState, useEffect, useCallback } from 'react';
import {FlatList, StyleSheet, View, Text, RefreshControl} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Button} from "react-native-paper";

import HeaderButton from "../components/UI/HeaderButton";
import ProductItem from "../components/UI/ProductItem";
import colors from '../config/colors';

import * as listingActions from "../store/actions/listing";
import {useDispatch, useSelector} from "react-redux";

const ListingsScreen = (props) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.listing);
    const [loading, setLoading] = useState(false);

    const loadFeed = useCallback(async () => {
        setLoading(true);
        try{
            await dispatch(listingActions.fetchFeed());
        }catch (err) {
            console.log("Error in ListingScreen", err);
            setLoading(false);
        }
        setLoading(false);
    },[dispatch]);

    useEffect(() => {
        props.navigation.addListener('focus', loadFeed);
        return () => {
            props.navigation.removeListener('focus', loadFeed);
        };
    }, [loadFeed]);

    useEffect(() => {
        setLoading(true);
        loadFeed().then(() => {
            setLoading(false);
        });
    }, [dispatch, loadFeed]);

    useEffect(() => {
        props.navigation.setOptions({
            title: "Feed",
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        //title={"Search"}
                        iconName={"ios-search"}
                        onPress={() => {
                            props.navigation.navigate("SearchScreen");
                        }}
                    />
                </HeaderButtons>
            )
        });
    });

    return (
        <View style={styles.screen}>
            { data.listing_data ?
                (
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={loadFeed} />
                        }
                        data={data.listing_data}
                        renderItem={(itemData) => {
                            //console.log("Itemdata", itemData.item.images[0].url);
                            return(
                                <ProductItem
                                    image={itemData.item.images[0].url}
                                    title={itemData.item.title}
                                    price={itemData.item.price}
                                    onSelect={() => props.navigation.navigate("ListingDetailsScreen", {
                                        listing:itemData.item
                                    })}
                                >
                                    <Button
                                        icon="more"
                                        color={colors.medium}
                                        uppercase={false}
                                        mode={"outlined"}
                                        onPress={() =>
                                            props.navigation.navigate("ListingDetailsScreen", {
                                                listing:itemData.item
                                        })}
                                    >
                                        More Detail
                                    </Button>
                                </ProductItem>
                            );
                        }}
                    />
            ) : (<><View style={styles.centered}><Text>Currently No Feed</Text></View></>)}
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        padding:20,
        backgroundColor: colors.light
    },
    centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ListingsScreen;

