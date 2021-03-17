import React, {useState, useEffect, useCallback} from 'react';
import {
    View,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Dimensions,
    TouchableOpacity,
    AlertIOS, ToastAndroid, ActivityIndicator
} from 'react-native';
//import {Image} from 'react-native-expo-image-cache';
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
import {Avatar, IconButton, Snackbar, TextInput} from "react-native-paper";

const ListingDetailsScreen = (props) => {
    const {t, i18n} = props;
    const ownerId = useSelector((state) => state.auth.userData.userId);
    const listing = props.route.params.listing;
    const images = props.route.params.images;
    const [listedUser, setListedUser] = useState({});
    const [text, setText] = useState('');
    const [visible, setVisible] = useState(false);
    const [imageName, setImageName] = useState('');

    const nameImageHandler = (nameData) => {
        let name = nameData.split(" ");
        const newName = name.map((name) => name[0]).join('');
        setImageName(newName.toUpperCase());
    };

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
                            feed_count: res.data.feed.length,
                            userImage: res.data.user.profile_img
                        }
                        setListedUser(user);
                        if(user.userImage === ""){
                            nameImageHandler(user.username)
                        }
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
                    {t("detail_screen:posted")} {moment(new Date(listing.updatedAt)).fromNow()}{","} {listing.prefecture}
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
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            keyboardVerticalOffset={50}
            style={{flex:1}}
        >
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
                <Text style={[styles.textNormal, {marginTop:10}]}>GNF {listing.price}</Text>
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
                    <TouchableOpacity
                        style={{flexDirection: "row", backgroundColor: colors.white, paddingHorizontal: 25, paddingVertical: 15,marginTop: 20, borderRadius: 20}}
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
                    >
                        {listedUser.userImage === "" ?
                            <Avatar.Text style={{backgroundColor: colors.medium}} size={80} label={imageName} />
                            :
                            <>
                                <Image
                                    style={{width: 80, height: 80, borderRadius: 200}}
                                    source={{uri: listedUser.userImage}}
                                />
                            </>
                        }
                        <View style={{marginHorizontal: 20, justifyContent: "center"}}>
                            <Text style={{fontSize: 28}}>{listedUser.username}</Text>
                            <Text style={{fontSize: 15, color:colors.medium}}>{listedUser.feed_count + " " +t("detail_screen:listings")}</Text>
                        </View>
                    </TouchableOpacity>
                {/*<View style={styles.userContainer}>*/}
                {/*    <ListItem*/}
                {/*        onPress={() => {*/}
                {/*            if(ownerId === listing.owner){*/}
                {/*                props.navigation.navigate("AccountNavigator")*/}
                {/*            }else {*/}
                {/*                props.navigation.navigate("UserProfileScreen",{*/}
                {/*                    listing: listing,*/}
                {/*                    listedUser: listedUser*/}
                {/*                })*/}
                {/*            }*/}
                {/*        }}*/}
                {/*        image={{uri: listedUser.userImage}}*/}
                {/*        title={listedUser.username}*/}
                {/*        subTitle={listedUser.feed_count + " " +t("detail_screen:listings")}*/}
                {/*    />*/}
                {/*</View>*/}
                {/*<ContactSellerForm listing={listing} />*/}
            </View>
        </ScrollView>
            <Snackbar
                visible={visible}
                duration={7000}
                onDismiss={onDismissSnackBar}
                theme={{
                    colors: {
                        onSurface: "rgb(9,222,9)",
                    },
                }}
            >
                {t("detail_screen:toast_msg")}
            </Snackbar>
        </KeyboardAvoidingView>
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
        color: colors.white,
    }
})

export default translate(["detail_screen"],{wait: true})(ListingDetailsScreen);
