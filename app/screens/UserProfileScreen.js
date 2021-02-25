import React, {useEffect, useState, useCallback} from "react";
import {View, StyleSheet, Text, FlatList, RefreshControl, ActivityIndicator} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Button} from "react-native-paper";
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {translate} from "react-i18next";
import frMoment from "moment/locale/fr";
import enMoment from "moment/locale/en-ca";

import colors from "../config/colors";
import * as listingActions from "../store/actions/listing";
import ProductItem from "../components/UI/ProductItem";

const UserProfileScreen = (props) => {
    const {t, i18n} = props;
    const listing = props.route.params.listing;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.listing.listing_profileData);
    const userData = useSelector((state) => state.listing.user_profileData);
    const [loading, setLoading] = useState(false);
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        props.navigation.setOptions({
            headerShown: false
        })
    });

    const loadFeed = useCallback(async () => {
        setLoading(true);
        try {
            await dispatch(listingActions.fetchProfileListing(listing.owner));
        } catch (err) {
            console.log("Error in ProfileScreen", err);
            setLoading(false);
        }
        setLoading(false);
    }, [dispatch]);

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
        const sortBy = (item) => {
            return item.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) );
        }
        setSortedData(sortBy(data));
    });

    if(loading){
        return (
            <View style={styles.profile}>
                <ActivityIndicator size={"large"} color={colors.primary}/>
            </View>
        );
    }

    return(
        <View style={styles.screen}>
            <View style={styles.profile}>
                <Ionicons
                    style={styles.close}
                    name="ios-close-circle"
                    size={35}
                    onPress={() => props.navigation.goBack()}
                />
                <Text style={styles.username}>{userData.username}</Text>
                <Text style={styles.phone}>Contact : {userData.phone}</Text>
            </View>
            <View style={styles.dataView}>
            <FlatList
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={loadFeed}/>
                }
                data={sortedData}
                renderItem={(itemData) => {
                    //console.log("listings", itemData.item);
                    let posted;
                    if(i18n.language === 'fr'){
                        moment.updateLocale('fr', frMoment)
                        posted = moment(itemData.item.updatedAt).fromNow()
                    }else {
                        moment.updateLocale('en', enMoment)
                        posted = moment(itemData.item.updatedAt).fromNow()
                    }
                    return (
                        <ProductItem
                            image={itemData.item.images[0].url}
                            title={itemData.item.title}
                            price={itemData.item.price}
                            phone={itemData.item.contact_phone}
                            posted={posted}
                            onSelect={() => props.navigation.navigate("ListingDetailsScreen", {
                                listing: itemData.item
                            })}
                        >
                            <Button
                                icon="more"
                                color={colors.medium}
                                uppercase={false}
                                mode={"outlined"}
                                onPress={() => {
                                    let images = itemData.item.images.map((item) => {
                                        return item.url;
                                    })
                                    props.navigation.navigate("ListingDetailsScreen", {
                                        listing: itemData.item,
                                        images: images
                                    })
                                }}
                            >
                                {t("listing_screen:btn")}
                            </Button>
                        </ProductItem>
                    );
                }}
            />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        backgroundColor: colors.light
    },
    close: {
        marginVertical: 40,
        marginHorizontal: 30,
        position: "absolute",
        top: 0,
        left: 0,
        color: colors.medium
    },
    profile:{
        flex: 1,
        justifyContent:"center",
        alignItems: "center"
    },
    username:{
        fontSize: 30,
        color:colors.primary
    },
    phone:{
        fontSize: 15,
        color: colors.medium
    },
    dataView:{
        flex: 2,
    }
});

export default translate(["listing_screen"],{wait: true})(UserProfileScreen);
