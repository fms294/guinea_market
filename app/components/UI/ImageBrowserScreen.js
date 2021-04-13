import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import {ImageBrowser} from 'expo-image-picker-multiple';
import {translate} from "react-i18next";
import colors from "../../config/colors";

const ImageBrowserScreen = (props) => {
    const {t} = props;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t("ImageBrowser:title")
        })
    })

    const _getHeaderLoader = () => {
        if (loading) {
            return(
                <ActivityIndicator size='small' color={'#0580FF'}/>
            );
        }
    };

    const imagesCallback = async (photos) => {
        const { navigation } = props;
        navigation.setOptions({
            headerRight: () => _getHeaderLoader()
        });
        setLoading(true);
        try {
            const cPhotos = [];
            for (let photo of photos) {
                const pPhoto = await _processImageAsync(photo.uri);
                cPhotos.push({
                    uri: pPhoto.uri,
                    name: photo.filename,
                    type: 'image/jpg'
                })
            }
            setLoading(false);
            if(props.route.params.from === "Edit") {
                navigation.navigate("ListingEditScreen", {photos: cPhotos});
            } else {
                navigation.navigate("ListingUpdateScreen", {photos: cPhotos});
            }
        }catch (e) {
            console.log("Catch in function....", e)
        }
    };

    const _processImageAsync = async (uri) => {
        const file = await ImageManipulator.manipulateAsync(
            uri,
            [{resize: { width: 1000 }}],
            { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        return file;
    };

    const _renderDoneButton = (count, onSubmit) => {
        if (!count) return null;
        return <TouchableOpacity title={'Done'} onPress={onSubmit}>
            <Text style={styles.rightText} onPress={onSubmit}>{t("ImageBrowser:done")}</Text>
        </TouchableOpacity>
    }

    const updateHandler = (count, onSubmit) => {
        props.navigation.setOptions({
            title: `${t("ImageBrowser:selected")} ${count} ${t("ImageBrowser:files")}`,
            headerRight: () => _renderDoneButton(count, onSubmit)
        });
    };

    const renderSelectedComponent = (number) => (
        <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>
    );

    const emptyStayComponent = <Text style={styles.emptyStay}>Empty =(</Text>;

    return (
        <View style={[styles.flex, styles.container]}>
            <ImageBrowser
                max={10}
                onChange={updateHandler}
                callback={imagesCallback}
                renderSelectedComponent={renderSelectedComponent}
                emptyStayComponent={emptyStayComponent}
                loadCompleteMetadata={true}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1
    },
    container: {
        position: 'relative'
    },
    emptyStay:{
        textAlign: 'center',
    },
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 50,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#0580FF'
    },
    countBadgeText: {
        // fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    },
    rightText:{
        marginTop: 1,
        marginRight: 10,
        color: colors.primary,
        fontSize: 15,
        fontWeight: "500"
    }
});

export default translate(["ImageBrowser"], {wait: true})(ImageBrowserScreen);
