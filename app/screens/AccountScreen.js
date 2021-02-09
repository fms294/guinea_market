import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList, Alert, Text} from 'react-native';

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Icon from  '../components/Icon';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import {useDispatch, useSelector} from "react-redux";
import * as authActions from "../store/actions/auth";
import {Button} from "react-native-paper";
import { translate } from 'react-i18next';

const AccountScreen = (props) => {
    const {t} = props;
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    //console.log("userData", userData);

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

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t("account_screen:account")
        })
    })

    const logoutHandler = () => {
        Alert.alert(t("account_screen:alert_title"), t("account_screen:alert_msg"), [
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
                <ListItem
                    title={userData.username}
                    subTitle={userData.userPhone}
                    image ={require('../assets/fanta.jpeg')}
                />
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
                                onPress={() => props.navigation.navigate(item.targetScreen)}
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
    }
})

export default translate(['account_screen'],{wait: true})(AccountScreen);
