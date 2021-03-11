import React, {useEffect, useState, useCallback} from "react";
import {ActivityIndicator, StyleSheet, View, FlatList, Text, KeyboardAvoidingView, Platform} from "react-native";
import {translate} from "react-i18next";

import {conversation, sendMessage} from "../api/apiCall";
import colors from "../config/colors";
import {TextInput, IconButton} from "react-native-paper";

const ChatScreen = (props) => {
    const {t} = props;
    const chatId = props.route.params.id;
    const [text, setText] = useState('');
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputHeight, setInputHeight] = useState();

    useEffect(() => {
        props.navigation.setOptions({
            title: props.route.params.name
        });
    });

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
                                style={[styles.messageView, {alignItems: itemData.item.flag === 0 ? "flex-end" : "flex-start"}]}>
                                <Text style={styles.textView}>{itemData.item.message_data}</Text>
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
                            sendMessageHandler()
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
        flex: 1
    },
    textView:{
        fontSize: 20,
        borderWidth: 1,
        borderColor: colors.medium,
        borderRadius: 10,
        padding:10,
        color:colors.primary,
        marginHorizontal: 20
    },
    inputView:{
        flexDirection: "row",
        marginLeft: 20,
        marginVertical: 10,
    }
});

export default translate([], {wait: true})(ChatScreen);
