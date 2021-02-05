import React, {useEffect} from 'react';
import {StyleSheet, View, FlatList, Alert, Text} from 'react-native';

import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Icon from  '../components/Icon';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import {useDispatch, useSelector} from "react-redux";
import * as authActions from "../store/actions/auth";
import {Button} from "react-native-paper";
import {Ionicons} from "@expo/vector-icons";

const menuItems = [
    {
        title: "My Listings",
        icon: {
            name: "format-list-bulleted",
            backgroundColor: colors.primary
        },
        targetScreen: "MyListingsScreen"
    },
    {
        title: "My Message",
        icon: {
            name: "email",
            backgroundColor: colors.secondary,
        },
        targetScreen:"MessagesScreen",
    }
]

const AccountScreen = (props) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);
    //console.log("userData", userData);

    useEffect(() => {
        props.navigation.setOptions({
            title: "Account"
        })
    })

    const logoutHandler = () => {
        Alert.alert('Are you sure ?', 'Do you really want to logout ?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    await dispatch(authActions.logout());
                    //props.navigation.navigate("AuthNavigator");
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
                    onPress={() => logoutHandler()}>Logout</Button>
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

export default AccountScreen;
