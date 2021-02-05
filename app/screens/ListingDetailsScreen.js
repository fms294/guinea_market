import React, {useState, useEffect, useCallback} from 'react';
import { View,  StyleSheet, KeyboardAvoidingView, Platform, Dimensions} from 'react-native';
import {Image} from 'react-native-expo-image-cache';
import { SliderBox } from "react-native-image-slider-box";
import {useDispatch, useSelector} from "react-redux";
import { fetchOtherUser } from "../api/apiCall";

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Text from '../components/Text';

const ListingDetailsScreen = (props) => {
    const dispatch = useDispatch();
    const listing = props.route.params.listing;
    const images = props.route.params.images;
    const [listedUser, setListedUser] = useState({});

    useEffect(() => {
        props.navigation.setOptions({
            title: props.route.params.listing.title
        })
    })

    useEffect(() => {
        const loadOtherUser = async () => {
            try {
                await fetchOtherUser(listing.owner)
                    .then((res) => {
                        const user = {
                            username: res.data.user.username,
                            feed_count: res.data.feed.length
                        }
                        setListedUser(user);
                    }).catch((err) => {
                        console.log("err...", err);
                    })
            } catch (err) {
                console.log("Error in ListingScreen", err);
            }
        };

        loadOtherUser();
    }, [fetchOtherUser]);

    return (
        <View>
            <SliderBox
                images={images}
                sliderBoxHeight={Dimensions.get('window').width > 400 ? 250 : 200}
                dotColor={colors.primary}
                inactiveDotColor="#90A4AE"
                autoplay
                circleLoop
            />
            <View style={styles.detailContainer}>
                <Text style={styles.title}>{listing.title}</Text>
                <Text style={styles.price}>GNF {listing.price}</Text>
                <Text style={styles.contact}>Contact Info : {listing.contact_phone}</Text>
                <View style={styles.userContainer}>
                    <ListItem
                        image={{uri: listing.images[0].url}}
                        title={listedUser.username}
                        subTitle={listedUser.feed_count + " Listings"}
                    />
                </View>
                {/*<ContactSellerForm listing={listing} />*/}
            </View>
        </View>
    )
};

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
        fontSize:18,
        marginVertical:10
    },
    userContainer:{
        marginVertical:50
    },
    title:{
        fontSize: 20,
        fontWeight: "bold"
    },
    contact:{
        fontSize: 18
    }
})


export default ListingDetailsScreen;
