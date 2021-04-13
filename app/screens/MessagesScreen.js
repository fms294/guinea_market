import React, {useCallback, useEffect, useState} from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Text,
    Alert,
    RefreshControl
} from 'react-native';

import ListItem from '../components/lists/ListItem';
import Screen from '../components/Screen';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import ListItemDeleteAction from '../components/lists/ListItemDeleteAction';
import {conversation, deleteConversation, fetchOtherUser, receiveMessage, sentMessage} from "../api/apiCall";
import {useSelector} from "react-redux";
import colors from "../config/colors";
import Icon from "../components/Icon";
import {Avatar, IconButton} from "react-native-paper";
import * as authActions from "../store/actions/auth";
import {translate} from "react-i18next";

const MessagesScreen = (props) => {
    const {t} = props;
    const [data, setData] = useState(props.route.params.data);
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState('');
    // const dataLocal = data;
    // const global = chats;

    const nameImageHandler = (username) => {
        let name = username.split(" ");
        const newName = name.map((name) => name[0]).join('');
        // setImageName(newName.toUpperCase());
        return newName.toUpperCase();
    };

    useEffect(() => {
        props.navigation.setOptions({
            title: "Messages"
        })
    });

    const loadOtherUser = useCallback(async () => {
        setLoading(true);
        try {
            let array = [];
            await data.map(async (item) => {
                await fetchOtherUser(item)
                    .then((res) => {
                        if(res !== null){
                            // console.log("res", res.data.user);
                            const obj = {
                                id: res.data.user._id,
                                username: res.data.user.username,
                                profile: res.data.user.profile_img
                            }
                            array.push(obj);
                            setChats(array);
                            if(res.data.user.profile_img === ""){
                                nameImageHandler(res.data.user.username)
                            }
                        }
                    }).catch((err) => {
                        console.log("err.....", err);
                    })
            })
        } catch (err) {
            setLoading(false);
            console.log("Error in MessageScreen", err);
        }
        setLoading(false);
    }, [fetchOtherUser]);

    // useEffect(() => {
    //     props.navigation.addListener('focus', loadOtherUser);
    //     return () => {
    //         props.navigation.removeListener('focus', loadOtherUser);
    //     };
    // }, [loadOtherUser]);

    useEffect(() => {
        setLoading(true);
        loadOtherUser().then(() => {
            setLoading(false);
        });
    }, [loadOtherUser]);

    // const loadConversation = useCallback(async () => {
    //     try {
    //         setLoading(true);
    //         await data.map(async (item) => {
    //         await conversation(item)
    //             .then((res) => {
    //                 let array = [];
    //                 let arr = [];
    //                 let temp = [];
    //                 let aa = [];
    //                 if (res !== null) {
    //                     array = res.data.received.sort((a,b)=>a.updatedAt-b.updatedAt);
    //                     arr = res.data.sent.sort((a,b)=>a.updatedAt-b.updatedAt);
    //                     // console.log("converstion...received",array[array.length - 1]);
    //                     // console.log("converstion... sent",arr[arr.length - 1]);
    //                     temp.push(array[array.length - 1]);
    //                     temp.push(arr[arr.length - 1]);
    //                     aa = temp.sort((a,b)=>a.updatedAt-b.updatedAt);
    //                     // console.log("final ...",aa[aa.length -1]);
    //                 }
    //             }).catch((err) => {
    //                 console.log("err.....", err);
    //             })
    //         })
    //         setLoading(false);
    //     } catch (err) {
    //         setLoading(false);
    //         console.log("Error in MessageScreen", err);
    //     }
    // }, [conversation]);
    //
    // useEffect(() => {
    //     props.navigation.addListener('focus', loadConversation);
    //     return () => {
    //         props.navigation.removeListener('focus', loadConversation);
    //     };
    // }, [loadConversation]);
    //
    // useEffect(() => {
    //     setLoading(true);
    //     loadConversation().then(() => {
    //         setLoading(false);
    //     });
    // }, [loadConversation]);

    if (loading) {
        return(
            <View style={styles.centered}>
                <ActivityIndicator size={"large"} color={colors.primary}/>
            </View>
        );
    }

    // const handleDelete = message => {
    //     //Delete the message from message
    //     setMessages(messages.filter( m => m.id !== message.id));
    // };

    const chatHandler = (item) => {
        console.log("id...", item.id);
        props.navigation.navigate("ChatScreen", {
            id: item.id,
            name: item.username
        });
    }

    const deleteChat = async (id) => {
            Alert.alert(t("message_screen:alert_title"), t("message_screen:alert_msg"), [
                { text: t("account_screen:no"), style: 'default' },
                {
                    text: t("account_screen:yes"),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteConversation(id)
                                .then((res) => {
                                    console.log("response of delete...");
                                    const values = chats.filter((item) => item.id !== id);
                                    setChats(values);
                                    let ids = [];
                                    values.map((itemInner) => {
                                        ids.push(itemInner.id);
                                    })
                                    console.log(ids);
                                    setData(ids);
                                }).catch((err) => {
                                    console.log("catch in delete...", err);
                                })
                            setLoading(false);
                        }catch (e) {
                            setLoading(false);
                            console.log("catch in delete", e);
                        }
                    }
                },
            ]);
    }

    return (
        <View style={styles.screen}>
                <FlatList
                    data={chats}
                    ItemSeparatorComponent={ListItemSeparator}
                    keyExtractor={item => item.id}
                    renderItem={(itemData) => {
                        // console.log("itemData", itemData.item)
                        return (
                            <TouchableOpacity
                                style={styles.chatView}
                                onPress={() => chatHandler(itemData.item)}
                            >
                                <View style={{flexDirection: "row"}}>
                                {itemData.item.profile === "" ?
                                    <Avatar.Text style={{backgroundColor: colors.medium}} size={70} label={nameImageHandler(itemData.item.username)} />
                                    :
                                    <Image
                                        style={styles.image}
                                        source={{uri: itemData.item.profile}}
                                    />
                                }
                                <View style={{marginHorizontal: 20, justifyContent: "center"}}>
                                    <Text style={{fontSize: 24}}>{itemData.item.username}</Text>
                                </View>
                                </View>
                                <View>
                                    <IconButton
                                        icon={"delete"}
                                        color={colors.danger}
                                        size={24}
                                        onPress={() => deleteChat(itemData.item.id)}
                                    />
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1
    },
    centered:{
        flex:1,
        justifyContent: "center",
        alignItems: "center"
    },
    image:{
        height: 70,
        width: 70,
        borderRadius: 100
    },
    chatView:{
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 20
    }
});

export default translate(["message_screen", "account_screen"], {wait: true})(MessagesScreen);
