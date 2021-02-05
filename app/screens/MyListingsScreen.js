import React, {useCallback, useEffect, useState} from "react";
import {FlatList, RefreshControl, Text, View, StyleSheet, Alert, ActivityIndicator, SafeAreaView} from "react-native";
import ProductItem from "../components/UI/ProductItem";
import {Button} from "react-native-paper";
import colors from "../config/colors";
import {useDispatch, useSelector} from "react-redux";

import * as listingActions from "../store/actions/listing";
import {Ionicons} from "@expo/vector-icons";

const MyListingsScreen = (props) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props.navigation.setOptions({
            title: "Listings"
        })
    })

    const data = useSelector((state) => state.listing.listing_userData);
    //console.log("data...", data.listing_userData.length);

    const loadFeed = useCallback(async () => {
        setLoading(true);
        try {
            await dispatch(listingActions.fetchUserFeed());
        } catch (err) {
            console.log("Error in ListingScreen", err);
            setLoading(false);
        }
        setLoading(false);
    }, [dispatch]);

    const deleteFeedHandler = (id) => {
        Alert.alert('Are you sure ?', 'Do you really want to Delete this item?', [
            {text: 'No', style: 'default'},
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    try {
                        setLoading(true);
                        await dispatch(listingActions.deleteUserFeed(id));
                        loadFeed();
                        setLoading(false);
                    } catch (err) {
                        console.log('Error while Deleting product' + err.message);
                        setLoading(false);
                    }
                },
            },
        ]);
    };

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

    return(
        <View style={styles.screen}>
            {data.length === 0 ? (
                <>
                    <View style={styles.centered}>
                        <Button
                            color={colors.dark}
                            uppercase={false}
                            mode={"outlined"}
                            onPress={() => {
                                props.navigation.navigate("ListingEditScreen")
                            }}>
                            <Ionicons name={"add-circle-outline"} size={24}/>
                            <Text style={styles.buttonText}> Start Selling</Text>
                        </Button>
                    </View>
                </>
            ) : (
                    <FlatList
                        refreshControl={
                            <RefreshControl refreshing={loading} onRefresh={loadFeed}/>
                        }
                        data={data}
                        renderItem={(itemData) => {
                            //console.log("listings", itemData.item);
                            return (
                                <ProductItem
                                    image={itemData.item.images[0].url}
                                    title={itemData.item.title}
                                    price={itemData.item.price}
                                    phone={itemData.item.contact_phone}
                                    onSelect={() => props.navigation.navigate("ListingDetailsScreen", {
                                        listing: itemData.item
                                    })}
                                >
                                    <Button
                                        icon="delete"
                                        color={colors.danger}
                                        uppercase={false}
                                        mode={"outlined"}
                                        onPress={deleteFeedHandler.bind(this, itemData.item.id)}
                                    >
                                        Delete Item
                                    </Button>
                                </ProductItem>
                            );
                        }}
                    />
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        backgroundColor: colors.light
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText:{
        fontSize: 24,
        marginTop: 0
    }
})

export default MyListingsScreen;

// props.navigation.navigate("ListingDetailsScreen", {
//     listing: itemData.item
// })

