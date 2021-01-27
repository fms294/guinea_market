import React, { useState, useEffect, useCallback } from 'react';
import {FlatList, StyleSheet, View, Text, RefreshControl, TouchableOpacity} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Button, Searchbar} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";

import HeaderButton from "../components/UI/HeaderButton";
import ProductItem from "../components/UI/ProductItem";
import colors from '../config/colors';

import * as listingActions from "../store/actions/listing";
import {useDispatch, useSelector} from "react-redux";

const ListingsScreen = (props) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.listing);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [iconSet, setIconSet] = useState("magnify");
    const [filterVisible, setFilterVisible] = useState("Home");
    const [activeFilter, setActiveFilter] = useState("");

    const onChangeSearch = (query) => {
        console.log("search", query);
        setSearchQuery(query);
        setIconSet("arrow-left");
    };

    const onIconPress = () => {
        console.log("pressed");
        setSearchVisible(false);
        setIconSet("magnify");
    }

    const filterView = (active) => {
        setFilterVisible("Filter")
        if (active === "Category") {
            setActiveFilter("Category");
        } else if (active === "Region") {
            setActiveFilter("Region");
        } else {
            setActiveFilter("Home");
        }
    }

    const loadFeed = useCallback(async () => {
        setLoading(true);
        try {
            await dispatch(listingActions.fetchFeed());
        } catch (err) {
            console.log("Error in ListingScreen", err);
            setLoading(false);
        }
        setLoading(false);
    }, [dispatch]);

    useEffect(() => {
        props.navigation.addListener('focus', loadFeed);
        return () => {
            props.navigation.removeListener('focus', loadFeed);
        };
    }, [loadFeed]);

    useEffect(() => {
        setLoading(true);
        loadFeed().then(() => {
            setLoading(false);
        });
    }, [dispatch, loadFeed]);

    useEffect(() => {
        props.navigation.setOptions({
            title: "Feed",
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        //title={"Search"}
                        iconName={"ios-search"}
                        onPress={() => {
                            setSearchVisible(!searchVisible);
                            setSearchQuery('');
                            setIconSet("magnify")
                        }}
                    />
                </HeaderButtons>
            ),
        });
    });

    return (
        <View style={styles.screen}>
            {!searchVisible ? <></> : <Searchbar
                placeholder="Search"
                icon={iconSet}
                onChangeText={onChangeSearch}
                value={searchQuery}
                onIconPress={onIconPress}
            />}
            <View style={styles.visibleContent}>
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={activeFilter === "Category" ? [styles.filterObject, {borderColor: colors.primary}] : styles.filterObject}
                    onPress={() => {
                        filterView("Category");
                    }}
                >
                    <Text style={styles.filterText}>Category</Text>
                    <Ionicons
                        size={15}
                        name={activeFilter === "Category" ? "chevron-up" : "chevron-down"}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={activeFilter === "Region" ? [styles.filterObject, {borderColor: colors.primary}] : styles.filterObject}
                    onPress={() => {
                        filterView("Region")
                    }}
                >
                    <Text style={styles.filterText}>Region</Text>
                    <Ionicons size={15} name={activeFilter === "Region" ? "chevron-up" : "chevron-down"}/>
                </TouchableOpacity>
            </View>
            {filterVisible !== "Home" ?
                <>
                    {activeFilter === "Category" ?
                        <View style={styles.centered}>
                            <Text>All Category soon</Text>
                            <Button
                                color={colors.medium}
                                uppercase={false}
                                mode={"outlined"}
                                onPress={() => {
                                    setFilterVisible("Home");
                                    setActiveFilter('');
                            }}>Apply</Button>
                        </View>
                        :
                        <View style={styles.centered}>
                            <Text>All Region soon</Text>
                            <Button
                                color={colors.medium}
                                uppercase={false}
                                mode={"outlined"}
                                onPress={() => {
                                    setFilterVisible("Home");
                                    setActiveFilter('');
                            }}>Apply</Button>
                        </View>
                    }
                </> : <>
                    {data.listing_data ?
                        (
                            <FlatList
                                style={{marginTop: !searchVisible ? 0 : 32}}
                                refreshControl={
                                    <RefreshControl refreshing={loading} onRefresh={loadFeed}/>
                                }
                                data={data.listing_data}
                                renderItem={(itemData) => {
                                    //console.log("Itemdata", itemData.item.images[0].url);
                                    return (
                                        <ProductItem
                                            image={itemData.item.images[0].url}
                                            title={itemData.item.title}
                                            price={itemData.item.price}
                                            onSelect={() => props.navigation.navigate("ListingDetailsScreen", {
                                                listing: itemData.item
                                            })}
                                        >
                                            <Button
                                                icon="more"
                                                color={colors.medium}
                                                uppercase={false}
                                                mode={"outlined"}
                                                onPress={() =>
                                                    props.navigation.navigate("ListingDetailsScreen", {
                                                        listing: itemData.item
                                                    })}
                                            >
                                                More Detail
                                            </Button>
                                        </ProductItem>
                                    );
                                }}
                            />
                        ) : (<><View style={styles.centered}><Text>Currently No Feed</Text></View></>)}
                </>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        backgroundColor: colors.light
    },
    visibleContent:{
        flex: 1
    },
    filterContainer:{
        flex: 1,
        flexDirection: 'row'
    },
    filterObject:{
        flex: 1,
        flexDirection: 'row',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        margin: 2
    },
    filterText:{
        fontSize: 15
    },
    centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    flatList:{
        marginTop: 0
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    openButton: {
        marginTop: 20
    },
    modalText: {
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        fontSize: 30,
        color: colors.primary
    }
})

export default ListingsScreen;

//const [modalVisible, setModalVisible] = useState(false);

// headerLeft: () => (
//     <HeaderButtons HeaderButtonComponent={HeaderButton}>
//         <Item
//             //title={"Search"}
//             iconName={"filter"}
//             onPress={() => {
//                 //console.log("filter")
//                 setModalVisible(true);
//             }}
//         />
//     </HeaderButtons>
// ),

// <Modal
//     animationType="slide"
//     transparent={true}
//     visible={modalVisible}
//     onRequestClose={() => {
//         setModalVisible(!modalVisible)
//     }}
// >
//     <View style={styles.centeredView}>
//         <View style={styles.modalView}>
//             <Text style={styles.modalText}>Demo Filter</Text>
//             <TouchableOpacity
//                 style={styles.openButton}
//                 onPress={() => {
//                     setModalVisible(!modalVisible)
//                 }}
//             >
//                 <Text>Cancel</Text>
//             </TouchableOpacity>
//         </View>
//     </View>
// </Modal>
