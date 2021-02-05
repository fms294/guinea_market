import React, { useState, useEffect, useCallback } from 'react';
import {FlatList, StyleSheet, View, Text, RefreshControl, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Button, Searchbar} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";

import HeaderButton from "../components/UI/HeaderButton";
import ProductItem from "../components/UI/ProductItem";
import colors from '../config/colors';
import {categories, regions} from "../data/data";

import * as listingActions from "../store/actions/listing";

const ListingsScreen = (props) => {
    const dispatch = useDispatch();
    const data = useSelector((state) => state.listing.listing_data);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [iconSet, setIconSet] = useState("magnify");
    const [filterVisible, setFilterVisible] = useState("Home");
    const [activeFilter, setActiveFilter] = useState("");
    const [category, setCategory] = useState([]);
    const [region, setRegion] = useState([]);

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

    const applyFilter = () => {
        let filterObject = {
            category: category,
            region: region
        }
        console.log("Filters : ", filterObject);
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

    // if(loading) {
    //     return(
    //         <View style={styles.centered}>
    //             <ActivityIndicator size={'large'} color={colors.primary}/>
    //         </View>
    //     );
    // }
    //
    // if(!loading && data.listing_data === [] ) {
    //     return(
    //         <View style={styles.centered}>
    //             <Text>No feeds</Text>
    //         </View>
    //     );
    // }

    return (
        <View style={styles.screen}>
            {!searchVisible ?
                <></> :
                <>
                    {filterVisible === "Home" ? <Searchbar
                        placeholder="Search"
                        icon={iconSet}
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        onIconPress={onIconPress}
                    /> : <>
                        {Alert.alert("In-accessible",
                            "While applying filter you cannot search for product.",
                            [{text: "Okay", onPress: () => setSearchVisible(false)}]
                        )}
                    </>
                    }
                </>
            }
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
                        <View style={styles.filterDisplay}>
                            <Text style={styles.filterTitle}>Filter Your Category</Text>
                            <FlatList
                                data={categories}
                                keyExtractor={(item) => item.category.toString()}
                                renderItem={(itemData) => {
                                    if (itemData.item.sub_category === undefined) {
                                        return (
                                            <TouchableOpacity onPress={() => {
                                                if (!category.includes(itemData.item.category)) {
                                                    setCategory([...category, itemData.item.category]);
                                                } else {
                                                    setCategory(category.filter((item) => (item !== itemData.item.category)))
                                                }
                                            }}>
                                                <Text
                                                    style={category.includes(itemData.item.category) ? [styles.main_category, {color: colors.primary}] : styles.main_category}>
                                                    {itemData.item.category}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    } else {
                                        return (
                                            <>
                                                <Text style={styles.main_category}>{itemData.item.category} : </Text>
                                                {itemData.item.sub_category.map((item, index) =>
                                                    <TouchableOpacity key={index} onPress={() => {
                                                        if (!category.includes(item)) {
                                                            setCategory([...category, item]);
                                                        } else {
                                                            setCategory(category.filter((item) => (item !== item)))
                                                        }
                                                    }}>
                                                        <Text
                                                            style={category.includes(item) ? [styles.sub_category, {color: colors.primary}] : styles.sub_category}>{item}</Text>
                                                    </TouchableOpacity>
                                                )}
                                            </>
                                        );
                                    }
                                }}
                            />
                            <View style={styles.filterButton}>
                                <Button
                                    style={{flex: 2}}
                                    color={colors.medium}
                                    uppercase={false}
                                    mode={"outlined"}
                                    onPress={() => {
                                        setFilterVisible("Home");
                                        setActiveFilter('');
                                        if(category.length !== 0){
                                            applyFilter()
                                        }
                                    }}>{category.length === 0 ? "Close" : "Apply"}</Button>
                                <Button
                                    style={{flex: 2}}
                                    color={colors.medium}
                                    uppercase={false}
                                    mode={"outlined"}
                                    onPress={() => {
                                        setCategory([]);
                                    }}>Clear</Button>
                            </View>
                        </View>
                        :
                        <View style={styles.filterDisplay}>
                            <Text style={styles.filterTitle}>Filter Your Region</Text>
                            <FlatList
                                data={regions}
                                keyExtractor={(item) => item.toString()}
                                renderItem={(itemData) => {
                                    return (
                                        <TouchableOpacity onPress={() => {
                                            if (!region.includes(itemData.item)) {
                                                setRegion([...region, itemData.item]);
                                            } else {
                                                setRegion(region.filter((item) => (item !== itemData.item)))
                                            }
                                        }}>
                                            <Text
                                                style={region.includes(itemData.item) ? [styles.main_category, {color: colors.primary}] : styles.main_category}>
                                                {itemData.item}
                                            </Text>
                                        </TouchableOpacity>)
                                }}
                            />
                            <View style={styles.filterButton}>
                            <Button
                                style={{flex: 2}}
                                color={colors.medium}
                                uppercase={false}
                                mode={"outlined"}
                                onPress={() => {
                                    setFilterVisible("Home");
                                    setActiveFilter('');
                                    if(region.length !== 0){
                                        applyFilter()
                                    }
                                }}>{region.length === 0 ? "Close" : "Apply"}</Button>
                            <Button
                                style={{flex: 2}}
                                color={colors.medium}
                                uppercase={false}
                                mode={"outlined"}
                                onPress={() => {
                                    setRegion([]);
                                }}>Clear</Button>
                            </View>
                        </View>
                    }
                </> : <>
                    {data.length === 0 ? (<><View style={styles.centered}><Text>Currently No Feed</Text></View></>) :
                        (
                            <FlatList
                                refreshControl={
                                    <RefreshControl refreshing={loading} onRefresh={loadFeed}/>
                                }
                                data={data}
                                renderItem={(itemData) => {
                                    //console.log("listings", itemData.item);
                                    return (
                                        <ProductItem
                                            image={itemData.item.images[0].url}
                                            title={itemData.item.title}
                                            price={itemData.item.price}
                                            phone={itemData.item.contact_phone}
                                            onSelect={() => {
                                                let images = itemData.item.images.map((item) => {
                                                    return item.url;
                                                })
                                                props.navigation.navigate("ListingDetailsScreen", {
                                                    listing: itemData.item,
                                                    images: images
                                                })
                                            }}
                                        >
                                            <Button
                                                icon="more"
                                                color={colors.medium}
                                                uppercase={false}
                                                mode={"outlined"}
                                                onPress={() => {
                                                    let images = itemData.item.images.map((item) => {
                                                        return item.url;
                                                    })
                                                    props.navigation.navigate("ListingDetailsScreen", {
                                                        listing: itemData.item,
                                                        images: images
                                                    })
                                                }}
                                            >
                                                More Detail
                                            </Button>
                                        </ProductItem>
                                    );
                                }}
                            />
                        )}
                </>}
        </View>
    )
};

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        backgroundColor: colors.light
    },
    filterContainer:{
        flexDirection: 'row',
        marginTop: 5
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
    filterButton:{
        flexDirection: "row",
    },
    centered:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    filterDisplay:{
        flex: 1
    },
    filterTitle:{
        fontSize: 25,
        fontWeight: "bold",
        marginVertical: 10,
        textAlign: "center"
    },
    main_category:{
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 10,
        marginHorizontal: 30
    },
    sub_category:{
        fontSize: 15,
        fontWeight: "bold",
        marginVertical: 7,
        marginHorizontal: 50
    }
})

export default ListingsScreen;
