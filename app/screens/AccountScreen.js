import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';

import Screen from '../components/Screen';
import ListItem from '../components/ListItem';
import colors from '../config/colors';
import Icon from  '../components/Icon';
import ListItemSeparator from '../components/ListItemSeparator';

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
            backgroundColor: colors.secondary
        }
    
    }

]

function AccountScreen(props){
    return(
        <Screen style={styles.screen}>
            <View style={styles.container}>
                <ListItem 
                    title="Fanta"
                    subTitle="best online shop in Guinea"
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