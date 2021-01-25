import React from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';

import Screen from '../components/Screen';
import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Icon from  '../components/Icon';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import {useDispatch, useSelector} from "react-redux";
import * as authActions from "../store/actions/auth";

const menuItems = [
    {
        title: "My Listings ",
        icon: {
            name:"format-list-bulleted",
            backgroundColor: colors.primary
        }

    },
    {
        title: "My Message ",
        icon: {
            name:"email",
            backgroundColor: colors.secondary,
        },
        targetScreen:"Messages",
    }
]

const AccountScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.userData);

    const logoutHandler = () => {
        Alert.alert('Are you sure ?', 'Do you really want to logout ?', [
            { text: 'No', style: 'default' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    await dispatch(authActions.logout());
                    navigation.navigate("AuthNavigator");
                },
            },
        ]);
    }

    return(
        <Screen style={styles.screen}>
            <View style={styles.container}>
                <ListItem
                    title={userData.username}
                    subTitle={userData.userEmail}
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
                                onPress={() => navigation.navigate(item.targetScreen)}
                            />
                        )
                    }
                }
                />
            </View>
            <ListItem
                title="Log Out"
                IconComponent={
                    <Icon
                        name="logout"
                        backgroundColor="#ffe66d"
                    />
                }
                onPress = {() => logoutHandler() }
            />
        </Screen>
    )
}

const styles = StyleSheet.create({
    container:{
        marginVertical:20
    },
    screen:{
        backgroundColor: colors.light
    }
})

export default AccountScreen;
