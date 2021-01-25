import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from "react-native";
import {Searchbar} from "react-native-paper";
import {HeaderButtons, Item} from "react-navigation-header-buttons";
import Modal from "react-native-modal";

import HeaderButton from "../components/UI/HeaderButton";
import colors from "../config/colors";

const SearchScreen = (props) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const onChangeSearch = (query) => {
        console.log("search", query);
        setSearchQuery(query);
    };

    useEffect(() => {
        props.navigation.setOptions({
            title: "Search",
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item
                        //title={"Search"}
                        iconName={"filter"}
                        onPress={() => {
                            //console.log("filter")
                            setModalVisible(true);
                        }}
                    />
                </HeaderButtons>
            ),
        })
    });

    return(
        <View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Modal</Text>
                        <TouchableOpacity
                            style={styles.openButton}
                            onPress={() => {
                                setModalVisible(!modalVisible)
                            }}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        marginTop: 22
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
});

export default SearchScreen;
