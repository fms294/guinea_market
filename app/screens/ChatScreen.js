import React, {useEffect, useState, useCallback} from "react";
import {ActivityIndicator, StyleSheet, View, FlatList, Text, KeyboardAvoidingView, Platform, Image} from "react-native";
import {translate} from "react-i18next";

import {conversation, fetchOtherUser, sendMessage, sendNotification} from "../api/apiCall";
import colors from "../config/colors";
import {TextInput, IconButton, Avatar} from "react-native-paper";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import HeaderButton from "../components/UI/HeaderButton";
import {StackActions, useNavigationState} from "@react-navigation/native";
import {useSelector} from "react-redux";

const ChatScreen = (props) => {
    const {t} = props;
    const chatId = props.route.params.id;
    const ownerId = useSelector((state) => state.auth.userData.userId);
    const ownerName = useSelector((state) => state.auth.userData.username);
    const [text, setText] = useState('');
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listedUser, setListedUser] = useState({});
    const [imageName, setImageName] = useState('');

    const nameImageHandler = (username) => {
        let name = username.split(" ");
        const newName = name.map((name) => name[0]).join('');
        setImageName(newName.toUpperCase());
    };

    // console.log(props.navigation);
    // const index = useNavigationState(state => state.index);
    // console.log("index...",index);
    // const index = useNavigationState(state => state.index);
    // if(index === 0) {}

    useEffect(() => {
        const loadOtherUser = async () => {
            try {
                setLoading(true);
                await fetchOtherUser(chatId)
                    .then((res) => {
                        if(res.data.user !== null) {
                            const user = {
                                username: res.data.user.username,
                                userNotification_token: res.data.user.notification_token,
                                userProfile: res.data.user.profile_img
                            }
                            setListedUser(user);
                            if (res.data.user.profile_img === "") {
                                nameImageHandler(res.data.user.username)
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

    const headerBarOne = () => {
        props.navigation.setOptions({
            title: props.route.params.name,
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        //title={"Search"}
                        iconName={"ios-person"}
                        onPress={() => {
                            props.navigation.dispatch(
                                StackActions.replace("AccountScreen")
                            )
                        }}
                    />
                </HeaderButtons>
            )
        });
    }

    const headerBarTwo = () => {
        props.navigation.setOptions({
            title: props.route.params.name
        });
    }

    const index = useNavigationState(state => state.index);
    if(index === 0) {
        headerBarOne()
    } else {
        headerBarTwo()
    }

    const loadConversation = useCallback(async () => {
        try {
            setLoading(true);
            await conversation(chatId)
                .then((res) => {
                    let array = [];
                    if (res !== null) {
                        if (res.data.received) {
                            res.data.received.map((item) => {
                                item["flag"] = 1;
                                //console.log("in received",item);
                                array.push(item);
                            });
                        }
                        if (res.data.sent) {
                            res.data.sent.map((item) => {
                                item["flag"] = 0;
                                //console.log("in sent",item);
                                array.push(item);
                            });
                        }
                        setMessage(sortBy(array))
                    }
                }).catch((err) => {
                    console.log("err.....", err);
                })
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log("Error in MessageScreen", err);
        }
    }, [conversation]);

    useEffect(() => {
        props.navigation.addListener('focus', loadConversation);
        return () => {
            props.navigation.removeListener('focus', loadConversation);
        };
    }, [loadConversation]);

    useEffect(() => {
        setLoading(true);
        loadConversation().then(() => {
            setLoading(false);
        });
    }, [loadConversation]);

    const sendMessageHandler = async () => {
        try {
            const messageObj = {
                message_data: text,
                receiver: chatId
            }
            await sendMessage(messageObj)
                .then((res) => {
                    //console.log("Message send", res);
                    loadConversation();
                }).catch((err) => {
                   // console.log("Message send error", err);
                })
        } catch (err) {
            console.log(err);
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

    const sortBy = (item) => {
        return item.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size={"large"} color={colors.primary}/>
            </View>
        );
    }

    // const onContentSizeChange = (event) => {
    //     let padding = Platform.OS === "ios" ? 20 : 0;
    //     setInputHeight(event.nativeEvent.contentSize.height + padding)
    // };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : ""}
            keyboardVerticalOffset={90}
            style={{flex:1}}
        >
            {message.length === 0 ?
                <></>
                :
                <View style={{flex: 1}}>
                <FlatList
                    // refreshControl={
                    //     <RefreshControl refreshing={loading} onRefresh={loadConversation()}/>
                    // }
                    inverted={true}
                    data={message}
                    keyExtractor={item => item._id}
                    renderItem={(itemData) => {
                        //console.log("itemData received...", itemData.item);
                        return (
                            <View
                                style={{alignItems: itemData.item.flag === 0 ? "flex-end" : "flex-start"}}>
                                <View style={styles.messageView}>
                                {itemData.item.flag === 1 ?
                                    <>
                                        {listedUser.userProfile === "" ?
                                            <Avatar.Text style={{backgroundColor: colors.medium}} size={30} label={imageName} />
                                            :
                                            <Image
                                                style={{height:30, width:30, borderRadius: 100}}
                                                source={{uri: listedUser.userProfile}}
                                            />
                                        }
                                    </>
                                    :
                                    <></>}
                                <Text style={styles.textView}>{itemData.item.message_data}</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            <View style={styles.inputView}>
                <TextInput
                    // style={{flex:1, paddingHorizontal: 10, borderWidth: 2, borderColor: colors.medium, fontSize: 18}}
                    style={{flex:1}}
                    placeholder={t("detail_screen:type_msg")}
                    value={text}
                    onChangeText={text => setText(text)}
                    // onContentSizeChange={(event) => {
                    //     onContentSizeChange(event)
                    // }}
                />
                <IconButton
                    icon="send"
                    color={colors.primary}
                    size={30}
                    style={{marginTop:12}}
                    onPress={() => {
                        if(text !== ''){
                            setText("")
                            sendMessageHandler().then(() => {
                                // console.log("listed token", listedUser.userNotification_token, text, ownerName);
                                sendNotificationHandler(listedUser.userNotification_token, ownerName, text, ownerId);
                            })
                        }
                    }}
                />
            </View>
                </View>
            }
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    centered:{
        flex:1,
        justifyContent: "center",
        alignItems: "center"
    },
    messageView:{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginTop: 10
    },
    textView:{
        fontSize: 20,
        borderWidth: 1,
        borderColor: colors.medium,
        borderRadius: 10,
        padding:5,
        color:colors.primary,
        marginHorizontal: 10
    },
    inputView:{
        flexDirection: "row",
        marginLeft: 20,
        marginVertical: 10,
    }
});

export default translate([], {wait: true})(ChatScreen);
