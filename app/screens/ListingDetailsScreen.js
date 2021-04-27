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
    ActivityIndicator,
    Alert
} from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import {useSelector} from "react-redux";
import {fetchOtherUser, sendMessage, sendNotification} from "../api/apiCall";
import Ionicons from "@expo/vector-icons/Ionicons";
import {translate} from "react-i18next";
import moment from "moment";
import frMoment from "moment/locale/fr";
import enMoment from "moment/locale/en-ca";

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Text from '../components/Text';
import {Avatar, IconButton, Snackbar, TextInput} from "react-native-paper";
import * as Analytics from 'expo-firebase-analytics';
import AsyncStorage from "@react-native-community/async-storage";
import WelcomeScreen from "./WelcomeScreen";
import * as authActions from "../store/actions/auth";

const ListingDetailsScreen = (props) => {
    const {t, i18n} = props;
    // const ownerId = useSelector((state) => state.auth.userData.userId);
    // const ownerName = useSelector((state) => state.auth.userData.username);
    const [ownerId,setOwnerId] = useState("");
    const [ownerName, setOwnerName] = useState("");
    const listing = props.route.params.listing;
    const images = props.route.params.images;
    const [listedUser, setListedUser] = useState({});
    const [text, setText] = useState('');
    const [visible, setVisible] = useState(false);
    const [imageName, setImageName] = useState('');
    const [loading, setLoading] = useState(false);
    const [login, setLogin] = useState(false);

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
        AsyncStorage.getItem("userData")
            .then((res) => {
                setLogin(false);
                if(res !== null) {
                    const resData = JSON.parse(res);
                   //console.log("res..", resData);
                    setOwnerId(resData.userData.userId);
                    setOwnerName(resData.userData.username);
                }
            })
            .catch((err) => {
                console.log("catch", err)
            })
    })

    useEffect(() => {
        const loadOtherUser = async () => {
            try {
                setLoading(true);
                await fetchOtherUser(listing.owner)
                    .then((res) => {
                        if(res.data.user !== null) {
                            const user = {
                                username: res.data.user.username,
                                feed_count: res.data.feed.length,
                                userImage: res.data.user.profile_img,
                                userNotification_token: res.data.user.notification_token
                            }
                            setListedUser(user);
                            if (user.userImage === "") {
                                nameImageHandler(user.username)
                            }
                        } else {
                            setListedUser(null);
                        }
                        setLoading(false);
                    }).catch((err) => {
                        setLoading(false);
                        console.log("err.....", err);
                    })
            } catch (err) {
                setLoading(false);
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
            await AsyncStorage.getItem("userData")
                .then(async (res) => {
                    console.log("res..", res)
                    if(res === null) {
                        throw new Error("Can't send message")
                    }else {
                        await sendMessage(messageObj)
                            .then((res) => {
                                // console.log("Message send", res);
                            }).catch((err) => {
                                console.log("Message send error", err);
                            })
                    }
                }).catch((err) => {
                console.log("err..", err)
                    throw new Error("Can't send message")
                })
        } catch (err) {
            console.log("err in catch",err);
            throw new Error("Can't send message")
        }
    }

    const sendNotificationHandler = async (to, title, body, data) => {
        try {
            const finalObj = {
                to: to,
                title: title,
                body: body,
                priority: "high",
                sound: "default",
                channelId: "default",
                data: {screen: data}
            }
            // console.log("finalobj", finalObj);
            await sendNotification(finalObj)
                .then((res) => {
                    console.log("Notification sent", res);
                }).catch((err) => {
                    console.log("Notification sent error", err);
                })
        } catch (err) {
            console.log(err);
        }
    };

    // <View style={{flexDirection: 'row'}}>
    //     <Text style={styles.textNormal}>{'\u2022'}</Text>
    //     <Text style={[styles.textNormal, {paddingLeft: 5}]}>{t("detail_screen:st_1")}</Text>
    // </View>
    // <Text style={styles.textNormal}>{t("detail_screen:st_2")}</Text>
    // <Text style={styles.textNormal}>{t("detail_screen:st_3")}</Text>
    // <Text style={styles.textNormal}>{t("detail_screen:st_4")}</Text>

    const renderRow = () => {
        const points = [1,2,3,4];
        return (
            <View style={{padding: 5}}>
                {points.map((item) => (
                    <View style={{flexDirection: "row"}}>
                        <Text style={styles.textNormal}>{'\u2022'}</Text>
                        <Text style={[styles.textNormal, {fontSize: 15,paddingLeft: 7}]}>{t("detail_screen:st_"+item)}</Text>
                    </View>
                    ))
                }
            </View>
        );
    }

    const welcome = () => {
        props.navigation.navigate("WelcomeScreen", {
            listing : listing,
            images: images
        })
    }

    const profileHandler = async () => {
        await AsyncStorage.getItem("userData")
            .then((res) => {
                if(res !== null) {
                    if(ownerId === listing.owner) {
                        props.navigation.navigate("AccountNavigator")
                    }else {
                        props.navigation.navigate("UserProfileScreen",{
                            listing: listing,
                            listedUser: listedUser
                        })
                    }
                }else {
                    console.log("else...");
                    Alert.alert(t("listing_screen:alert_login_title"), t("listing_screen:alert_login_msg"), [
                        { text: t("listing_screen:cancel"), style: 'default' },
                        {
                            text: t("listing_screen:login"),
                            style: 'destructive',
                            onPress: async () => {
                                setLogin(true);
                            },
                        }
                    ]);
                }
            }).catch((err) => {
                console.log(err);
            })
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            keyboardVerticalOffset={50}
            style={{flex:1}}
        >
            {login ?
                <>{welcome()}</> :
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
                <Text style={[styles.textNormal, {marginTop:10}]}>GNF {Platform.OS === "ios" ? listing.price.toLocaleString() : listing.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                {i18n.language === 'fr' ? (
                    printDate("fr", "frMoment")
                ) : (
                    printDate("en", "enMoment")
                )}
                <Text style={[styles.title, {marginTop: 15, marginBottom: 5}]}>{t("detail_screen:desc")}</Text>
                <View style={{backgroundColor:colors.white, padding: 10}}>
                    <Text style={styles.textNormal}>{listing.description}</Text>
                </View>
                <Text style={[styles.title, {color: "red",marginTop: 15,fontSize: 18}]}>{t("detail_screen:st_title")}</Text>
                {renderRow()}
                {/*<Text style={styles.contact}>Contact Info : {listing.contact_phone}</Text>*/}
                {loading ?
                    <View style={styles.centered}>
                        <ActivityIndicator size={"large"} color={colors.primary}/>
                    </View>
                    :
                    <>
                        {listedUser === null ?
                            <>
                                <><Text style={{fontSize: 24,textAlign: "center", marginTop: 50, color: colors.medium}}>{t("detail_screen:no_owner")}</Text></>
                            </>
                            :
                            <>
                                {ownerId === listing.owner ? <></> :
                                    <View style={{flexDirection: "row", marginTop: 20}}>
                                    <TextInput
                                        style={{flex: 1}}
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
                                        style={{marginTop: 12}}
                                        onPress={() => {
                                        if (text !== '') {
                                        setText("")
                                        console.log("owner", ownerId === listing.owner);
                                        sendMessageHandler()
                                            .then(() => {
                                                console.log("listed token", listedUser);
                                                onToggleSnackBar();
                                                if(listedUser.userNotification_token !== "") {
                                                    sendNotificationHandler(listedUser.userNotification_token, ownerName, text, ownerId)
                                                }
                                            }).catch((err) => {
                                                Alert.alert(t("listing_screen:alert_login_title"), t("listing_screen:alert_login_msg"), [
                                                    { text: t("listing_screen:cancel"), style: 'default' },
                                                    {
                                                        text: t("listing_screen:login"),
                                                        style: 'destructive',
                                                        onPress: async () => {
                                                            setLogin(true);
                                                        },
                                                    }
                                        ]);
                                    console.log("erros..", err)
                                })
                                }
                                }}
                                    />
                                    </View>
                                }
                                <TouchableOpacity
                                    style={{flexDirection: "row", backgroundColor: colors.white, paddingHorizontal: 25, paddingVertical: 15,marginTop: 20, borderRadius: 20}}
                                    onPress={() => { profileHandler() }}
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
                            </>
                        }
                    </>
                }
            </View>
        </ScrollView> }
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
    centered: {
        padding: 40
    },
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
