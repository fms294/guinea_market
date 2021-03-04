import React, {useEffect, useState, useCallback} from "react";
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
    Alert,
    Platform, Image
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {Avatar, Button} from "react-native-paper";
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
    console.log(userData);

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

    const dialNumber = (phone) => {
        let number = "";
        if (Platform.OS === "ios") {
            number = `telprompt:${phone}`
        } else {
            number = `tel:${phone}`
        }
        Linking.canOpenURL(number)
            .then(supported => {
                console.log("support", supported)
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(number);
                }
            })
    };

    const openWhatsapp = (phone) => {
        Linking.openURL(`https://api.whatsapp.com/send?phone=${phone}8`)
    };

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
                {userData.profile_img === "" ?
                    <Avatar.Text style={{marginBottom: 15, backgroundColor: colors.medium}} size={100} label={"N/A"} />
                    :
                    <>
                        <Image
                            style={{marginBottom: 15 ,width: 100, height: 100, borderRadius: 200}}
                            source={{uri: userData.profile_img}}
                        />
                    </>
                }
                <Text style={styles.username}>{userData.username}</Text>
                <TouchableOpacity
                    style={{flexDirection: "row"}}
                    onPress={() => {dialNumber(userData.phone)}}
                >
                    <Ionicons
                        style={{margin: 10}}
                        name="call-outline"
                        size={30}
                        onPress={() => {dialNumber(userData.phone)}}
                    />
                    <Ionicons
                        style={{margin: 10}}
                        name="logo-whatsapp"
                        size={30}
                        onPress={() => {openWhatsapp(userData.phone)}}
                    />
                </TouchableOpacity>
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
                        posted = moment(new Date(itemData.item.updatedAt)).fromNow()
                    }else {
                        moment.updateLocale('en', enMoment)
                        posted = moment(new Date(itemData.item.updatedAt)).fromNow()
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
        justifyContent:"flex-end",
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
