import React, {useState, useEffect, useCallback} from 'react';
import { View,  StyleSheet, KeyboardAvoidingView, Platform, ScrollView ,Dimensions} from 'react-native';
import {Image} from 'react-native-expo-image-cache';
import { SliderBox } from "react-native-image-slider-box";
import {useSelector} from "react-redux";
import {fetchOtherUser, sendMessage} from "../api/apiCall";
import Ionicons from "@expo/vector-icons/Ionicons";
import {translate} from "react-i18next";
import moment from "moment";
import frMoment from "moment/locale/fr";
import enMoment from "moment/locale/en-ca";

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Text from '../components/Text';
import {Button, IconButton, Snackbar, TextInput} from "react-native-paper";

const ListingDetailsScreen = (props) => {
    const {t, i18n} = props;
    const ownerId = useSelector((state) => state.auth.userData.userId);
    const listing = props.route.params.listing;
    const images = props.route.params.images;
    const [listedUser, setListedUser] = useState({});
    const [text, setText] = useState('');
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        props.navigation.setOptions({
            //title: props.route.params.listing.title,
            headerShown: false
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
                        console.log("err.....", err);
                    })
            } catch (err) {
                console.log("Error in ListingScreen", err);
            }
        };

        loadOtherUser();
    }, [fetchOtherUser]);

    const printDate = (lang, type) => {
        moment.updateLocale(lang, type)
        return(
            <>
                <Text style={[styles.textNormal, {marginTop:10}]}>
                    {t("detail_screen:posted")} {moment(new Date(listing.updatedAt)).fromNow()}{","} {listing.region}
                </Text>
            </>
        );
    }

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const sendMessageHandler = async () => {
        try {
            const messageObj = {
                message_data: text,
                receiver: listing.owner
            }
            await sendMessage(messageObj)
                .then((res) => {
                    console.log("Message send", res);
                }).catch((err) => {
                    console.log("Message send error", err);
                })
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <View>
        <ScrollView>
                <SliderBox
                    resize={"cover"}
                    images={images}
                    sliderBoxHeight={Dimensions.get('window').width > 400 ? 350 : 300}
                    dotColor={colors.primary}
                    inactiveDotColor={colors.medium}//"#90A4AE"
                    //autoplay
                    //circleLoop
                />
               <Ionicons
                   style={styles.close}
                   name="ios-close-circle"
                   size={35}
                   onPress={() => {props.navigation.goBack()}}
               />
            <View style={styles.detailContainer}>
                <Text style={styles.title}>{listing.title}</Text>
                <Text style={[styles.textNormal, {marginTop:10}]}>fr {listing.price}</Text>
                {i18n.language === 'fr' ? (
                    printDate("fr", "frMoment")
                ) : (
                    printDate("en", "enMoment")
                )}
                <Text style={[styles.title, {marginTop: 15, marginBottom: 5}]}>{t("detail_screen:desc")}</Text>
                <View style={{backgroundColor:colors.white, padding: 10}}>
                    <Text style={styles.textNormal}>{listing.description}</Text>
                </View>
                {/*<Text style={styles.contact}>Contact Info : {listing.contact_phone}</Text>*/}
                {ownerId === listing.owner ? <></> :
                    <View style={{flexDirection: "row", marginTop: 20}}>
                        <TextInput
                            style={{flex:1}}
                            label={t("detail_screen:input_label")}
                            mode={"outlined"}
                            placeholder={t("detail_screen:input_placeholder")}
                            value={text}
                            onChangeText={text => setText(text)}
                        />
                        <IconButton
                            icon="send"
                            color={colors.primary}
                            size={30}
                            style={{marginTop:12}}
                            onPress={() => {
                                if(text !== ''){
                                    setText("")
                                    onToggleSnackBar()
                                    sendMessageHandler()
                                }
                            }}
                        />
                    </View>
                }
                <View style={styles.userContainer}>
                    <ListItem
                        onPress={() => {
                            if(ownerId === listing.owner){
                                props.navigation.navigate("AccountNavigator")
                            }else {
                                props.navigation.navigate("UserProfileScreen",{
                                    listing: listing,
                                    listedUser: listedUser
                                })
                            }
                        }}
                        image={{uri: listing.images[0].url}}
                        title={listedUser.username}
                        subTitle={listedUser.feed_count + " " +t("detail_screen:listings")}
                    />
                </View>
                {/*<ContactSellerForm listing={listing} />*/}
            </View>
        </ScrollView>
            <Snackbar
                visible={visible}
                duration={7000}
                onDismiss={onDismissSnackBar}
            >
                {t("detail_screen:toast_msg")}
            </Snackbar>
        </View>
    )
};

const styles = StyleSheet.create({
    detailContainer:{
        margin: 20
    },
    image:{
        width: "100%",
        height: 300
    },
    textNormal:{
        color: colors.medium,
        //fontWeight: 'bold',
        fontSize:18,
    },
    userContainer:{
        marginTop:20
    },
    title:{
        fontSize: 20,
        fontWeight: "bold"
    },
    contact:{
        fontSize: 18
    },
    close: {
        marginVertical: 40,
        marginHorizontal: 30,
        position: "absolute",
        top: 0,
        left: 0,
        color: colors.medium,
    }
})

export default translate(["detail_screen"],{wait: true})(ListingDetailsScreen);
