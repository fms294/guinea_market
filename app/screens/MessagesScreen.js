import React, {useCallback, useEffect, useState} from 'react';
import { FlatList, StyleSheet, View, Text, ActivityIndicator} from 'react-native';

import ListItem from '../components/lists/ListItem';
import Screen from '../components/Screen';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import ListItemDeleteAction from '../components/lists/ListItemDeleteAction';
import {fetchOtherUser, receiveMessage, sentMessage} from "../api/apiCall";
import {useSelector} from "react-redux";
import colors from "../config/colors";
import Icon from "../components/Icon";
import {List} from "react-native-paper";

const initialMessages =[
    {
        id:1,
        title: 'T1',
        description: 'D1',
        image:require('../assets/fanta.jpeg')

    },
    {
        id:2,
        title: 'T2',
        description: 'D2',
        image:require('../assets/fanta.jpeg')

    }
]

const MessagesScreen = (props) => {
    const [messages, setMessages] = useState(initialMessages);
    const [refreshing, setRefreshing] = useState(false);
    const data = props.route.params.data;
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(false);

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
                            //console.log("res", res.data.user._id);
                            const obj = {
                                id: res.data.user._id,
                                username: res.data.user.username
                            }
                            array.push(obj);
                            setChats(array);
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

    // useEffect(() => {
    //     const loadOtherUser = async () => {
    //         try {
    //                 setLoading(true);
    //                 let array = [];
    //                 await data.map(async (item) => {
    //                     await fetchOtherUser(item)
    //                         .then((res) => {
    //                             console.log("res", res.data.user.username);
    //                             array.push(res.data.user.username);
    //                         }).catch((err) => {
    //                             console.log("err.....", err);
    //                         })
    //                 })
    //                 setChats(array);
    //                 setLoading(false);
    //         } catch (err) {
    //             console.log("Error in MessageScreen", err);
    //         }
    //     };
    //
    //     loadOtherUser();
    // }, [fetchOtherUser]);

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
                        //console.log("itemData", itemData.item)
                        return (
                            <ListItem
                                title={itemData.item.username}
                                onPress={() => chatHandler(itemData.item)}
                            />
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
    }
});

export default MessagesScreen;

//         <ListItem
//             title={item.title}
//             subTitle={item.description}
//             image={item.image}
//             onPress={() => console.log("Message Selected", item)}
//             renderRightActions={() =>
//                 <ListItemDeleteAction
//                     onPress={() => handleDelete(item)}
//                 />}
//
//         />
//         )}
//         ItemSeparatorComponent={ListItemSeparator}
//         refreshing={refreshing}
//         onRefresh={() =>{
//             setMessages([
//                 {
//                     id:2,
//                     title: 'T2',
//                     description: 'D2',
//                     image:require('../assets/fanta.jpeg')
//
//                 }
//             ])
//         }}
