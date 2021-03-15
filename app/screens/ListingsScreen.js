import React, { useState, useEffect, useCallback } from 'react';
import {
    FlatList,
    StyleSheet,
    View,
    Text,
    RefreshControl,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    Image
} from 'react-native';
import {HeaderButtons, Item} from 'react-navigation-header-buttons';
import {Button, Searchbar, List} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import { translate } from "react-i18next";
import moment from "moment";
import frMoment from "moment/locale/fr";
import enMoment from "moment/locale/en-ca";

import HeaderButton from "../components/UI/HeaderButton";
import ProductItem from "../components/UI/ProductItem";
import colors from '../config/colors';
import {categories, regions} from "../data/data";

import * as listingActions from "../store/actions/listing";

const ListingsScreen = (props) => {
    const {t, i18n} = props;
    const dispatch = useDispatch();
    const data = useSelector((state) => state.listing.listing_data);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [iconSet, setIconSet] = useState("magnify");
    const [filterVisible, setFilterVisible] = useState("Home");
    const [activeFilter, setActiveFilter] = useState("");
    const [filterApplied ,setFilterApplied] = useState(false);
    const [category, setCategory] = useState([]);
    const [region, setRegion] = useState([]);
    const [sortedData,setSortedData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    //console.log("listing screen",data);

    const onIconPress = () => {
        //console.log("pressed");
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

    const uniqueData = (oldArray) => {
        let newArray = [];
        let uniqueObject = {};
        for(let i in oldArray){
            let obj = oldArray[i]['id'];
            uniqueObject[obj] = oldArray[i];
        }
        for (let i in uniqueObject) {
            newArray.push(uniqueObject[i]);
        }
        return newArray;
    }

    let filterObject = {};

    const applyFilter = () => {
        filterObject = {
            category: category,
            region: region
        }
        //console.log("Filters : ", filterObject);
        setFilterData([]);
        if(filterObject.category.length === 0 && filterObject.region.length === 0){
            setFilterApplied(false);
        } else if(filterObject.category.length === 0 && filterObject.region.length !== 0) {
            setFilterApplied(true);
            let filterDataArray = [];
            filterObject.region.map(async (item) => {
                await sortedData.find((value) => {
                    if(value.region === item){
                        filterDataArray.push(value)
                    }
                });
            });
            if(filterDataArray.length !== 0){
                const uniqueArray = uniqueData(filterDataArray);
                setFilterData(sortBy(uniqueArray));
            }
        } else if(filterObject.category.length !== 0 && filterObject.region.length === 0) {
            setFilterApplied(true);
            let filterDataArray = [];
            filterObject.category.map(async (item) => {
                await sortedData.find((value) => {
                    if(value.main_category === item) {
                        filterDataArray.push(value);
                    }
                });
            });
            filterObject.category.map(async (item) => {
                await sortedData.find((value) => {
                    if(value.sub_category === item){
                        filterDataArray.push(value);
                    }
                });
            });
            if(filterDataArray.length !== 0){
                const uniqueArray = uniqueData(filterDataArray);
                setFilterData(sortBy(uniqueArray));
            }
        } else if(filterObject.category.length !== 0 && filterObject.region.length !== 0) {
            setFilterApplied(true);
            let filterDataArray = [];
            filterObject.category.map(async (catItem) => {
                filterObject.region.map(async (regionItem) => {
                    await sortedData.find((value) => {
                        if(value.main_category === catItem && value.region === regionItem) {
                            //console.log("final", value);
                            filterDataArray.push(value);
                        }
                    });
                })
            })
            filterObject.category.map(async (catItem) => {
                filterObject.region.map(async (regionItem) => {
                    await sortedData.find((value) => {
                        if(value.sub_category === catItem && value.region === regionItem) {
                            //console.log("final", value);
                            filterDataArray.push(value);
                        }
                    });
                })
            })
            if(filterDataArray.length !== 0){
                const uniqueArray = uniqueData(filterDataArray);
                setFilterData(sortBy(uniqueArray));
            }
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
            title: "",
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

    const sortBy = (item) => {
        // if(i18n.language === 'fr'){
        //     moment.updateLocale('fr', frMoment);
        //     console.log("value", moment.locale());
        //     let date = moment("Lun. 8 Févr. 2021 09:53").format('MM/DD/YYYY');
        //     let dateV = moment(new Date(date));
        //     console.log("dateV",date,dateV.format('llll'));
        //     //console.log("curr difffff...", item.sort((a, b) => moment(new Date(b.updatedAt)) - moment(new Date(a.updatedAt)) ));
        // }
        return item.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) );
    }

    useEffect(() => {
        setSortedData(sortBy(data));
    });

    const RenderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: '#CED0CE',
                }}
            />
        );
    };

    let titleForSearch = [];

    if (filterApplied) {
        for(let x in filterData){
            titleForSearch = titleForSearch.concat(filterData[x].title);
        }
    } else {
        for(let x in sortedData){
            titleForSearch = titleForSearch.concat(sortedData[x].title);
        }
    }

    const onChangeSearch = (query) => {
        //console.log("search", query);
        setSearchQuery(query);
        setIconSet("arrow-left");

        if(query === ""){
            setSearchData([]);
        }else{
            const newData = titleForSearch.filter((item) => {
                const itemData = item.toUpperCase();
                const textData = query.toUpperCase();

                return itemData.indexOf(textData) > -1;
            });
            setSearchData(newData);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                {/*<ActivityIndicator size={"large"} color={colors.primary}/>*/}
                <Image style={styles.logo} source={require("../assets/logo.png")}/>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            {searchVisible ?
                (
                    <>
                        <Searchbar
                            placeholder={t("listing_screen:search")}
                            icon={iconSet}
                            onChangeText={onChangeSearch}
                            value={searchQuery}
                            onIconPress={onIconPress}
                        />
                        {searchData.length === 0 ? (<><View style={styles.centered}><Text>{t("listing_screen:search_empty")}</Text></View></>) :
                            (
                                <>
                                    <FlatList
                                        data={searchData}
                                        keyExtractor={(item, index) => index.toString()}
                                        ItemSeparatorComponent={RenderSeparator}
                                        renderItem={({ item }) => (
                                            <List.Item
                                                title={item}
                                                onPress={() => {
                                                    const itemData = sortedData.filter((prod) => {
                                                        return prod.title === item;
                                                    });
                                                    itemData.map((value) => {
                                                        props.navigation.navigate("ListingDetailsScreen", {
                                                            listing: value,
                                                            images: value.images
                                                        });
                                                    })
                                                }}
                                            />
                                        )}
                                    />
                                </>
                            )
                        }
                    </>
                ) : (
                    <>
                        <View style={styles.filterContainer}>
                        <TouchableOpacity
                            style={activeFilter === "Category" ? [styles.filterObject, {borderColor: colors.primary}] : styles.filterObject}
                            onPress={() => {
                                filterView("Category");
                            }}
                        >
                            <Text style={styles.filterText}>{t("listing_screen:category")}</Text>
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
                            <Text style={styles.filterText}>{t("listing_screen:region")}</Text>
                            <Ionicons size={15} name={activeFilter === "Region" ? "chevron-up" : "chevron-down"}/>
                        </TouchableOpacity>
                    </View>
                        {filterVisible !== "Home" ?
                            <>
                                {activeFilter === "Category" ?
                                    <View style={styles.filterDisplay}>
                                        <Text style={styles.filterTitle}>{t("listing_screen:f_category")}</Text>
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
                                                                {/*{itemData.item.category + itemData.index }*/}
                                                                {t("category:" + itemData.index)}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    );
                                                } else {
                                                    return (
                                                        <>
                                                            <Text style={styles.main_category}>{t("category:" + itemData.index)} : </Text>
                                                            {itemData.item.sub_category.map((item, index) =>
                                                                <TouchableOpacity key={index} onPress={() => {
                                                                    if (!category.includes(item)) {
                                                                        setCategory([...category, item]);
                                                                    } else {
                                                                        setCategory(category.filter((item) => (item !== item)))
                                                                    }
                                                                }}>
                                                                    <Text style={category.includes(item) ? [styles.sub_category, {color: colors.primary}] : styles.sub_category}>
                                                                        {/*{item + itemData.index + index}*/}
                                                                        {t("category:"+itemData.index+"-"+index)}
                                                                    </Text>
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
                                                    applyFilter()
                                                }}>{category.length === 0 ? t("listing_screen:close") : t("listing_screen:apply")}</Button>
                                            <Button
                                                style={{flex: 2}}
                                                color={colors.medium}
                                                uppercase={false}
                                                mode={"outlined"}
                                                onPress={() => {
                                                    setCategory([]);
                                                }}>{t("listing_screen:clear")}</Button>
                                        </View>
                                    </View>
                                    :
                                    <View style={styles.filterDisplay}>
                                        <Text style={styles.filterTitle}>{t("listing_screen:f_region")}</Text>
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
                                                    applyFilter()
                                                }}>{region.length === 0 ? t("listing_screen:close") : t("listing_screen:apply") }</Button>
                                            <Button
                                                style={{flex: 2}}
                                                color={colors.medium}
                                                uppercase={false}
                                                mode={"outlined"}
                                                onPress={() => {
                                                    setRegion([]);
                                                }}>{t("listing_screen:clear")}</Button>
                                        </View>
                                    </View>
                                }
                            </>
                            :
                            <>
                                {filterApplied ?
                                    <>
                                        {filterData.length === 0 ? (<><View style={styles.centered}><Text>{t("listing_screen:filter_empty")}</Text></View></>) :
                                            (
                                                <FlatList
                                                    refreshControl={
                                                        <RefreshControl refreshing={loading} onRefresh={loadFeed}/>
                                                    }
                                                    //inverted
                                                    data={filterData}
                                                    keyExtractor={(item, index) => index.toString()}
                                                    renderItem={(itemData) => {
                                                        console.log("listings", itemData.item);
                                                        let posted;
                                                        if(i18n.language === 'fr'){
                                                            moment.updateLocale('fr', frMoment)
                                                            posted = moment(new Date(itemData.item.updatedAt)).fromNow()
                                                        }else {
                                                            moment.updateLocale('en', enMoment)
                                                            posted = moment(new Date(itemData.item.updatedAt)).fromNow()
                                                        }
                                                        return (
                                                            <ProductItem
                                                                image={itemData.item.images[0].url}
                                                                title={itemData.item.title}
                                                                price={itemData.item.price}
                                                                phone={itemData.item.contact_phone}
                                                                posted={posted}
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
                                                                    {t("listing_screen:btn")}
                                                                </Button>
                                                            </ProductItem>
                                                        );
                                                    }}
                                                />
                                            )}
                                    </>
                                    :
                                    <>
                                        {sortedData.length === 0 ? (<><View style={styles.centered}><Text>{t("listing_screen:no_feed")}</Text></View></>) :
                                            (
                                                <FlatList
                                                    refreshControl={
                                                        <RefreshControl refreshing={loading} onRefresh={loadFeed}/>
                                                    }
                                                    //inverted
                                                    data={sortedData}
                                                    renderItem={(itemData) => {
                                                        //console.log("listings", itemData.item);
                                                        let posted;
                                                        if (i18n.language === 'fr') {
                                                            moment.updateLocale('fr', frMoment)
                                                            posted = moment(new Date(itemData.item.updatedAt)).fromNow()
                                                        } else {
                                                            moment.updateLocale('en', enMoment)
                                                            posted = moment(new Date(itemData.item.updatedAt)).fromNow()
                                                        }
                                                        return (
                                                            <ProductItem
                                                                image={itemData.item.images[0].url}
                                                                title={itemData.item.title}
                                                                price={itemData.item.price}
                                                                phone={itemData.item.contact_phone}
                                                                posted={posted}
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
                                                                    {t("listing_screen:btn")}
                                                                </Button>
                                                            </ProductItem>
                                                        );
                                                    }}
                                                />
                                            )}
                                    </>
                                }
                            </>
                        }
                    </>
                )
            }
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
    },
    logo:{
        width:100,
        height:100,
        borderRadius:200
    },
})

export default translate(["listing_screen", "category"],{wait: true})(ListingsScreen);

