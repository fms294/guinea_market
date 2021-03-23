import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform
} from 'react-native';
import colors from "../../config/colors";
import { translate } from "react-i18next";

const ProductItem = (props) => {
    const {t} = props;
    return (
        <View style={styles.cardContainer}>
            <TouchableOpacity onPress={props.onSelect}>
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{uri: props.image}}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={styles.detailsContainer}>
                        <Text style={styles.title} numberOfLines={2} ellipsizeMode={'middle'}>
                            {props.title}
                        </Text>
                        <Text style={[styles.detail, {fontWeight: "bold",color: "green"}]} numberOfLines={1}>GNF {Platform.OS === "ios" ? props.price.toLocaleString() : props.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</Text>
                        <Text style={styles.detail}>{t("listing_screen:contact")}{props.phone}</Text>
                        <Text style={styles.posted}>{props.posted}</Text>
                        <View style={styles.actions}>{props.children}</View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        flex: 1,
        height: 200,
        marginHorizontal: Dimensions.get('window').width > 400 ? 20 : 10,
        marginVertical: 10,
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    card: {
        flexDirection: 'row',
        paddingHorizontal: 10,
    },
    imageContainer: {
        width: '40%',
        margin: Dimensions.get('window').width > 400 ? 10 : 5,
        borderRadius: 10,
        overflow: 'hidden',
        justifyContent: 'center',
    },
    image: {
        height: '100%',
        width: '100%',
        backgroundColor: colors.backgroundImage,
    },
    detailsContainer: {
        width: '60%',
        paddingVertical: 20,
        paddingHorizontal: 10,
        flexDirection: 'column',
    },
    title: {
        fontSize: Dimensions.get('window').width > 400 ? 18 : 14,
        fontWeight: 'bold',
    },
    detail: {
        marginTop: 10,
        fontSize: Dimensions.get('window').width > 400 ? 16 : 12,
        color: colors.medium,
    },
    posted: {
        marginTop: 10,
        fontSize: Dimensions.get('window').width > 400 ? 12 : 8,
        color: colors.medium,
    },
    actions: {
        //paddingHorizontal: Dimensions.get('window').width > 400 ? 15 : 5,
        //marginRight: Dimensions.get('window').width > 400 ? 15 : 5,
        bottom: Dimensions.get('window').width > 400 ? 10 : 5,
        position: 'absolute'
    },
});

export default translate(["listing_screen"],{wait: true})(ProductItem);
