import React, {useEffect, useState, useCallback} from 'react';
import {StyleSheet, View, FlatList, Alert, TouchableOpacity, Text, Image} from 'react-native';

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Icon from  '../components/Icon';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import {useDispatch, useSelector} from "react-redux";
import * as authActions from "../store/actions/auth";
import {Button, Avatar} from "react-native-paper";
import { translate } from 'react-i18next';
import {receiveMessage, sentMessage} from "../api/apiCall";

const AccountScreen = (props) => {
    const {t} = props;
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    const [receiver, setReceiver] = useState([]);
    const [sent, setSent] = useState([]);
    const [loading, setLoading] = useState(false);
    console.log("userData", userData);

    // const [imageName, setImageName] = useState('');
    //
    // const nameImageHandler = () => {
    //     let newName = '';
    //     let name = userData.username.split(' ');
    //     for (const x in name) {
    //         //newName = newName.concat(name[x].charAt(0));
    //         // if(name[x].charAt[0] === undefined){
    //             //console.log("name...", name[x]);
    //         // }
    //     }
    //     console.log(name.length);
    //     // setImageName(newName);
    // };
    //
    // useEffect(() => {
    //     nameImageHandler();
    //     // if (error) {
    //     //     Alert.alert('Error Occurred', error, [{text: 'Okay'}]);
    //     // }
    // }, [userData.username]);

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

    const loadReceivedMessage = useCallback(async () => {
        setLoading(true);
        try {
            await receiveMessage()
                .then(async (res) => {
                    //console.log("resdata receive", res.data);
                    if(res.data.length !== 0){
                        let arr = [];
                        res.data.map((item) => {
                            arr.push(item.sender);
                        })
                        const filtered = arr.filter((v, i, a) => a.indexOf(v) === i);
                        setReceiver(filtered);
                        //console.log("received res...", filtered);
                    }
                }).catch((err) => {
                    console.log("err.....", err);
                })
        } catch (err) {
            console.log("Error in MessageScreen", err);
            setLoading(false);
        }
        setLoading(false);
    }, [receiveMessage]);

    useEffect(() => {
        props.navigation.addListener('focus', loadReceivedMessage);
        return () => {
            props.navigation.removeListener('focus', loadReceivedMessage);
        };
    }, [loadReceivedMessage]);

    useEffect(() => {
        setLoading(true);
        loadReceivedMessage().then(() => {
            setLoading(false);
        });
    }, [loadReceivedMessage]);

    const loadSentMessage = useCallback(async () => {
        setLoading(true);
        try {
            await sentMessage()
                .then(async (res) => {
                    if(res.data.length !== 0){
                        //console.log("resdata sent", res.data);
                        let arr = [];
                        res.data.map((item) => {
                            arr.push(item.receiver);
                        })
                        const filtered = arr.filter((v, i, a) => a.indexOf(v) === i);
                        setSent(filtered);
                        //console.log("sent res...", filtered)
                    }
                }).catch((err) => {
                    console.log("err", err);
                })
        } catch (err) {
            console.log("Error in MessageScreen", err);
            setLoading(false);
        }
        setLoading(false);
    }, [sentMessage]);

    useEffect(() => {
        props.navigation.addListener('focus', loadSentMessage);
        return () => {
            props.navigation.removeListener('focus', loadSentMessage);
        };
    }, [loadSentMessage]);

    useEffect(() => {
        setLoading(true);
        loadSentMessage().then(() => {
            setLoading(false);
        });
    }, [loadSentMessage]);

    const menuItems = [
        {
            title: t("account_screen:listing"),
            icon: {
                name: "format-list-bulleted",
                backgroundColor: colors.primary
            },
            targetScreen: "MyListingsScreen"
        },
        {
            title: t("account_screen:message"),
            icon: {
                name: "email",
                backgroundColor: colors.secondary,
            },
            targetScreen:"MessagesScreen",
        },
        {
            title: t("account_screen:settings"),
            icon: {
                name: "cog",
                backgroundColor: colors.black,
            },
            targetScreen: "SettingScreen",
        },
        {
            title: t("account_screen:about"),
            icon: {
                name: "information-variant",
                backgroundColor: colors.backgroundImage,
            },
            targetScreen: "AboutScreen",
        },
    ];

    const messageHandler = () => {
        loadReceivedMessage();
        loadSentMessage();
        if(sent.length === 0 && receiver.length === 0){
            Alert.alert(t("account_screen:alert_title"), t("account_screen:alert_msg"), [{text: t("account_screen:okay")}])
        } else if(sent.length === 0 && receiver.length !== 0){
            //console.log("sent", receiver.unique())
            props.navigation.navigate("MessagesScreen", {
                data: receiver.unique()
            })
            //return receiver.unique();
        }else if(receiver.length === 0 && sent.length !== 0){
            //console.log("receive", sent.unique())
            props.navigation.navigate("MessagesScreen", {
                data: sent.unique()
            })
            //return sent.unique();
        }else{
            //console.log("both", receiver.concat(sent).unique())
            props.navigation.navigate("MessagesScreen", {
                data: receiver.concat(sent).unique()
            })
            //return receiver.concat(sent).unique();
        }
    }

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t("account_screen:account")
        })
    })

    const logoutHandler = () => {
        Alert.alert(t("account_screen:alert_title_logout"), t("account_screen:alert_msg_logout"), [
            { text: t("account_screen:no"), style: 'default' },
            {
                text: t("account_screen:yes"),
                style: 'destructive',
                onPress: async () => {
                    await dispatch(authActions.logout());
                },
            },
        ]);
    }

    return(
        <View style={styles.screen}>
            <View style={styles.container}>
                {/*<ListItem*/}
                {/*    title={userData.username}*/}
                {/*    subTitle={userData.userPhone}*/}
                {/*    image={{uri:userData.userImage}}*/}
                {/*    onPress={() => {*/}
                {/*        props.navigation.navigate("OwnerProfileScreen")*/}
                {/*    }}*/}
                {/*/>*/}
                <TouchableOpacity
                    style={{flexDirection: "row", backgroundColor: colors.white, padding: 20}}
                        onPress={() => {
                            props.navigation.navigate("OwnerProfileScreen")
                        }}
                >
                    {userData.userImage === "" ?
                        <Avatar.Text style={{backgroundColor: colors.medium}} size={80} label={"N/A"} />
                        :
                        <>
                            <Image
                                style={{width: 80, height: 80, borderRadius: 200}}
                                source={{uri: userData.userImage}}
                            />
                        </>
                    }
                    <View style={{marginHorizontal: 20, justifyContent: "center"}}>
                        <Text style={{fontSize: 28}}>{userData.username}</Text>
                        <Text style={{fontSize: 15, color:colors.medium}}>{userData.userPhone}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <FlatList
                    data={menuItems}
                    keyExtractor={menuItem => menuItem.title}
                    ItemSeparatorComponent={ListItemSeparator}
                    renderItem={({ item }) =>{
                        return (
                            <ListItem
                                title={item.title}
                                IconComponent={
                                    <Icon
                                        name={item.icon.name}
                                        backgroundColor={item.icon.backgroundColor}
                                    />
                                }
                                onPress={() => {
                                    if(item.targetScreen === "MessagesScreen"){
                                        messageHandler()
                                    }else{
                                        props.navigation.navigate(item.targetScreen)
                                    }
                                }}
                            />
                        )
                    }
                }
                />
            </View>
            <View style={styles.container}>
                <Button
                    style={styles.button}
                    labelStyle={styles.buttonText}
                    icon={"logout"}
                    color={colors.dark}
                    uppercase={false}
                    mode={"outline"}
                    onPress={() => logoutHandler()}>{t("account_screen:logout")}</Button>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        marginTop: 40
    },
    screen:{
        backgroundColor: colors.light
    },
    button:{
        backgroundColor: colors.white,
    },
    buttonText:{
        fontSize: 24
    },
    image:{
        backgroundColor: colors.medium,
    }
})

export default translate(['account_screen'],{wait: true})(AccountScreen);
