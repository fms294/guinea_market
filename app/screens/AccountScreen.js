import React, { useContext } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import authStorage from '../auth/storage';
import AuthContext from '../auth/context';
import Screen from '../components/Screen';
import ListItem from '../components/lists/ListItem';
import colors from '../config/colors';
import Icon from  '../components/Icon';
import ListItemSeparator from '../components/lists/ListItemSeparator';
import AuthNavigator from '../navigation/AuthNavigator';

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

function AccountScreen({ navigation }){
    const {user, setUser} = useContext(AuthContext);

    const handleLogOut = () =>{
        setUser(null);
        authStorage.removeToken();
    }

    return(
        <Screen style={styles.screen}>
            <View style={styles.container}>
                <ListItem 
                    title={user.name}
                    subTitle={user.email}
                    image ={require('../assets/fanta.jpeg')}
                />
            </View>
            <View style={styles.container}>
                <FlatList 
                    data={menuItems}
                    keyExtractor={menuItem => menuItem.title}
                    ItemSeparatorComponent={ListItemSeparator}
                    renderItem={({ item }) =>
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
                onPress = {handleLogOut}  
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