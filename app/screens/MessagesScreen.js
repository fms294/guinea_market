import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View, TouchableOpacity, ActivityIndicator, Image, Text} from 'react-native';

import ListItem from '../components/lists/ListItem';
import Screen from '../components/Screen';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import ListItemDeleteAction from '../components/lists/ListItemDeleteAction';
import {fetchOtherUser, receiveMessage, sentMessage} from "../api/apiCall";
import {useSelector} from "react-redux";
import colors from "../config/colors";
import Icon from "../components/Icon";
import {Avatar} from "react-native-paper";

const MessagesScreen = (props) => {
    const data = props.route.params.data;
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageName, setImageName] = useState('');

    const nameImageHandler = (username) => {
        let name = username.split(" ");
        const newName = name.map((name) => name[0]).join('');
        setImageName(newName.toUpperCase());
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

    useEffect(() => {
        props.navigation.addListener('focus', loadOtherUser);
        return () => {
            props.navigation.removeListener('focus', loadOtherUser);
        };
    }, [loadOtherUser]);

    useEffect(() => {
        setLoading(true);
        loadOtherUser().then(() => {
            setLoading(false);
        });
    }, [loadOtherUser]);

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
                                {itemData.item.profile === "" ?
                                    <Avatar.Text style={{backgroundColor: colors.medium}} size={70} label={imageName} />
                                    :
                                    <Image
                                        style={styles.image}
                                        source={{uri: itemData.item.profile}}
                                    />
                                }
                                <View style={{marginHorizontal: 20, justifyContent: "center"}}>
                                    <Text style={{fontSize: 24}}>{itemData.item.username}</Text>
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
        backgroundColor: colors.white,
        paddingVertical: 10,
        paddingHorizontal: 20
    }
});

export default MessagesScreen;
