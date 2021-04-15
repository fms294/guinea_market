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
    const [chats, setChats] = useState([]);
    const [sortedChat, setSortedChat] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noMessage, setNoMessage] = useState(false);

    const nameImageHandler = (username) => {
        let name = username.split(" ");
        const newName = name.map((name) => name[0]).join('');
        // setImageName(newName.toUpperCase());
        return newName.toUpperCase();
    };

    const sortBy = (item) => {
        return item.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) );
    }

    const sortByData = (item) => {
        return item.sort((a, b) => a.i - b.i );
    }

    useEffect(() => {
        props.navigation.setOptions({
            title: "Messages"
        })
    });

    Array.prototype.unique = function() {
        let a = this.concat();
        for(let i=0; i<a.length; ++i) {
            for(let j=i+1; j<a.length; ++j) {
                if(a[i] === a[j])
                    a.splice(j--, 1);
            }
        }
        return a;
    };

    const loadReceivedMessage = async () => {
        let filtered = [];
        try {
            await receiveMessage()
                .then((res) => {
                    // console.log("resdata receive", res.data);
                    if(res.data.length !== 0){
                        let arr = [];
                        res.data.map((item) => {
                            arr.push(item.sender);
                        })
                        filtered = arr.filter((v, i, a) => a.indexOf(v) === i);
                        // setReceiver(filtered);
                        //console.log("received res...", filtered);
                    }
                }).catch((err) => {
                    console.log("err.....", err);
                })
        } catch (err) {
            console.log("Error in MessageScreen", err);
        }
        return filtered;
    };

    const loadSentMessage = async () => {
        let filtered = [];
        try {
            await sentMessage()
                .then(async (res) => {
                    if(res.data.length !== 0){
                        // console.log("resdata sent", res.data);
                        let arr = [];
                        res.data.map((item) => {
                            arr.push(item.receiver);
                        })
                        filtered = arr.filter((v, i, a) => a.indexOf(v) === i);
                        // setSent(filtered);
                        //console.log("sent res...", filtered)
                    }
                }).catch((err) => {
                    console.log("err", err);
                })
        } catch (err) {
            console.log("Error in MessageScreen", err);
        }
        return filtered;
    };

    const loader = async () => {
        setLoading(true);
        const receiver = await loadReceivedMessage();
        const sent = await loadSentMessage();
        if(sent.length === 0 && receiver.length === 0){
            setNoMessage(true);
            setLoading(false);
            Alert.alert(t("account_screen:alert_title"), t("account_screen:alert_msg"), [{text: t("account_screen:okay")}])
        } else if(sent.length === 0 && receiver.length !== 0){
            await loadOtherUser(receiver.unique());
            setLoading(false);
        }else if(receiver.length === 0 && sent.length !== 0){
            await loadOtherUser(sent.unique());
            setLoading(false);
        }else{
            await loadOtherUser(receiver.concat(sent).unique());
            setLoading(false);
        }
    };

    useEffect(() => {
        props.navigation.addListener('focus', loader);
        return () => {
            props.navigation.removeListener('focus', loader);
        };
    }, [loader]);

    useEffect(() => {
        setLoading(true);
        loader().then(() => {
            setLoading(false);
        })
    }, []);

    const loadLastMessage = async (id) => {
        let array = [];
        try {
            setLoading(true);
            await conversation(id)
                .then((res) => {
                    if (res !== null) {
                        if (res.data.received) {
                           // console.log("receive last",res.data.received[res.data.received.length -1]);
                            const obj = res.data.received[res.data.received.length -1];
                            array.push(obj)
                        }
                        if (res.data.sent) {
                            //console.log("sent last",res.data.sent[res.data.sent.length -1]);
                            const obj = res.data.sent[res.data.sent.length -1];
                            array.push(obj)
                        }
                    }
                }).catch((err) => {
                    console.log("err.....", err);
                })
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log("Error in MessageScreen", err);
        }
        return array;
    };

    const loadOtherUser = async (data) => {
        // console.log("dataaaa in other",data);
        setLoading(true);
        try {
            let array = [];
            await data.map(async (item) => {
                await fetchOtherUser(item)
                    .then(async (res) => {
                        if(res !== null){
                            // console.log("res",item);
                            let received;
                            let sent;
                            const message = await loadLastMessage(item);
                            //console.log("array........", message)
                            message.map((item, index) => {
                                if(index === 0){
                                    //console.log("map in if", item);
                                    received = item;
                                } else {
                                    //console.log("map in else", item);
                                    sent = item;
                                }
                            });
                            const obj = {
                                id: res.data.user._id,
                                username: res.data.user.username,
                                profile: res.data.user.profile_img,
                                received: received,
                                sent: sent
                            }
                            array.push(obj);
                            if(array.length === data.length) {
                                loadConversation(array);
                            }
                            setChats(array);
                            if(res.data.user.profile_img === ""){
                                nameImageHandler(res.data.user.username)
                            }
                        }
                    }).catch((err) => {
                        console.log("err.....", err);
                    })
            });
            // await loadConversation();
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log("Error in MessageScreen", err);
        }
        setLoading(false);
    };

    const loadConversation = async (data) => {
        // console.log("load...",data);
        try {
            setLoading(true);
            let temp2 = [];
            await data.map(async (item) => {
            await conversation(item.id)
                .then(async (res) => {
                    let received = [];
                    let sent = [];
                    let temp = [];
                    let sortedChat = [];
                    if (res !== null) {
                        //.sort((a,b)=>a.updatedAt-b.updatedAt);
                        received = res.data.received;
                        sent = res.data.sent;
                        // console.log("converstion...received",array[array.length - 1]);
                        // console.log("converstion... sent",arr[arr.length - 1]);
                        if (received[received.length - 1] === undefined) {
                            temp.push(sent[sent.length - 1]);
                        }
                        if (sent[sent.length - 1] === undefined) {
                            temp.push(received[received.length - 1]);
                        }
                        if (received[received.length - 1] !== undefined && sent[sent.length - 1] !== undefined) {
                            temp.push(received[received.length - 1]);
                            temp.push(sent[sent.length - 1]);
                        }
                        sortedChat = sortBy(temp);
                        //console.log("final ...",sortedChat[0]);
                        temp2.push(sortedChat[0]);
                        if(temp2.length === data.length) {
                            const values = sortBy(temp2);
                            const final = values.map((item) => item._id);
                            setSortedChat(final);
                            // console.log("final sorted values...", chats);
                        }
                    }
                }).catch((err) => {
                    console.log("err.....", err);
                })
            });
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log("Error in MessageScreen", err);
        }
    };

    const sortChatsFinal = (chats, final, b) => {
        console.log("new ...",chats, final, b)
        try{
            let array = [];
            chats.map((itemData, i) => {
                final.map((item, index) => {
                    if(itemData.received !== undefined){
                        if(itemData.received._id === item){
                            //console.log("received",index, itemData)
                            const obj = {
                                i: index,
                                item : itemData
                            }
                            console.log(obj);
                            array.push(obj);
                        }
                    }
                    if(itemData.sent !== undefined) {
                        if(itemData.sent._id === item) {
                            //console.log("sent", index, itemData)
                            const obj = {
                                i: index,
                                item : itemData
                            }
                            console.log(obj);
                            array.push(obj);
                        }
                    }
                    if(array.length === chats.length) {
                        b = true;
                    }
                })
            })
            return sortByData(array);;
        }catch (e) {
            console.log("err in final set", e)
        }
    };

    if (loading) {
        return(
            <View style={styles.centered}>
                <ActivityIndicator size={"large"} color={colors.primary}/>
            </View>
        );
    }

    if (noMessage) {
        return(
            <View style={styles.centered}>
                <Text style={{fontSize: 20, color: colors.medium}}>{t("message_screen:no_message")}</Text>
            </View>
        );
    }

    const chatHandler = (item) => {
        // console.log("id...", item.id);
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
                                    if(values.length === 0) {
                                        setNoMessage(true);
                                    } else {
                                        setChats(values);
                                        let ids = [];
                                        values.map((itemInner) => {
                                            ids.push(itemInner.id);
                                        })
                                        console.log(ids);
                                    }
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
            {sortedChat.length !== 0 ?
                <>
                {sortChatsFinal(chats, sortedChat, false) ?
                    <>
                        <FlatList
                            refreshControl={
                                <RefreshControl
                                    refreshing={loading}
                                    onRefresh={loader}
                                />
                            }
                            data={sortChatsFinal(chats, sortedChat, false)}
                            ItemSeparatorComponent={ListItemSeparator}
                            keyExtractor={item => item.id}
                            renderItem={(itemData) => {
                                // console.log("itemData... 222", sortChatsFinal(chats, sortedChat, false).length)
                                    return (
                                        <TouchableOpacity
                                            style={styles.chatView}
                                            onPress={() => chatHandler(itemData.item.item)}
                                        >
                                            <View style={{flexDirection: "row"}}>
                                                {itemData.item.item.profile === "" ?
                                                    <Avatar.Text style={{backgroundColor: colors.medium}} size={70} label={nameImageHandler(itemData.item.item.username)} />
                                                    :
                                                    <Image
                                                        style={styles.image}
                                                        source={{uri: itemData.item.item.profile}}
                                                    />
                                                }
                                                <View style={{marginHorizontal: 20, justifyContent: "center"}}>
                                                    <Text style={{fontSize: 24}}>{itemData.item.item.username}</Text>
                                                </View>
                                            </View>
                                            <View>
                                                <IconButton
                                                    icon={"delete"}
                                                    color={colors.danger}
                                                    size={24}
                                                    onPress={() => deleteChat(itemData.item.item.id)}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                    );
                                }}
                        />
                    </>
                    :
                    <></>}
                </>
                :
                <></>
            }
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


// <FlatList
//     refreshControl={
//         <RefreshControl
//             refreshing={loading}
//             onRefresh={loader}
//         />
//     }
//     data={chats}
//     ItemSeparatorComponent={ListItemSeparator}
//     keyExtractor={item => item.id}
//     renderItem={(itemData) => {
//         // console.log("itemData...", sortedChat)
//         // console.log("itemData... 222", itemData.item)
//         return (
//             <TouchableOpacity
//                 style={styles.chatView}
//                 onPress={() => chatHandler(itemData.item)}
//             >
//                 <View style={{flexDirection: "row"}}>
//                 {itemData.item.profile === "" ?
//                     <Avatar.Text style={{backgroundColor: colors.medium}} size={70} label={nameImageHandler(itemData.item.username)} />
//                     :
//                     <Image
//                         style={styles.image}
//                         source={{uri: itemData.item.profile}}
//                     />
//                 }
//                 <View style={{marginHorizontal: 20, justifyContent: "center"}}>
//                     <Text style={{fontSize: 24}}>{itemData.item.username}</Text>
//                 </View>
//                 </View>
//                 <View>
//                     <IconButton
//                         icon={"delete"}
//                         color={colors.danger}
//                         size={24}
//                         onPress={() => deleteChat(itemData.item.id)}
//                     />
//                 </View>
//             </TouchableOpacity>
//         );
//     }}
// />
