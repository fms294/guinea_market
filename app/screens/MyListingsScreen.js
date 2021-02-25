import React, {useCallback, useEffect, useState} from "react";
import {FlatList, RefreshControl, Text, View, StyleSheet, Alert, ActivityIndicator, SafeAreaView} from "react-native";
import ProductItem from "../components/UI/ProductItem";
import {Button} from "react-native-paper";
import colors from "../config/colors";
import {useDispatch, useSelector} from "react-redux";
import { translate } from "react-i18next";
import frMoment from "moment/locale/fr";
import enMoment from "moment/locale/en-ca";

import * as listingActions from "../store/actions/listing";
import {Ionicons} from "@expo/vector-icons";
import moment from "moment";

const MyListingsScreen = (props) => {
    const {t, i18n} = props;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.listing.listing_userData);
    const [loading, setLoading] = useState(false);
    const [sortedData, setSortedData] = useState([]);

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t("my_listings:listings")
        })
    })

    const loadFeed = useCallback(async () => {
        setLoading(true);
        try {
            await dispatch(listingActions.fetchUserFeed(i18n.language));
        } catch (err) {
            console.log("Error in ListingScreen", err);
            setLoading(false);
        }
        setLoading(false);
    }, [dispatch]);

    const deleteFeedHandler = (id) => {
        Alert.alert(t("my_listings:alert_title"), t("my_listings:alert_msg"), [
            {text: t("my_listings:no"), style: 'default'},
            {
                text: t("my_listings:yes"),
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

    useEffect(() => {
        const sortBy = (item) => {
            return item.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) );
        }
        setSortedData(sortBy(data));
    });

    if(loading){
        return (
            <View style={styles.centered}>
                <ActivityIndicator size={"large"} color={colors.primary}/>
            </View>
        );
    }

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
                                props.navigation.jumpTo("ListingEditNavigator")
                            }}>
                            <Ionicons name={"add-circle-outline"} size={24}/>
                            <Text style={styles.buttonText}>{t("my_listings:start")}</Text>
                        </Button>
                    </View>
                </>
            ) : (
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
                                        icon="delete"
                                        color={colors.danger}
                                        uppercase={false}
                                        mode={"outlined"}
                                        onPress={deleteFeedHandler.bind(this, itemData.item.id)}
                                    >
                                        {t("my_listings:btn")}
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

export default translate(["my_listings"], {wait: true})(MyListingsScreen);

// props.navigation.navigate("ListingDetailsScreen", {
//     listing: itemData.item
// })

