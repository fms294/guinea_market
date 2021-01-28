import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import Colors from '../../config/colors';
import colors from "../../config/colors";

const ProductItem = (props) => {
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
                        <Text style={styles.detail} numberOfLines={1}>GNF {props.price.toLocaleString()}</Text>
                        <Text style={styles.detail}>Contact : {props.phone}</Text>
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
        color: Colors.medium,
    },
    actions: {
        //paddingHorizontal: Dimensions.get('window').width > 400 ? 15 : 5,
        //marginRight: Dimensions.get('window').width > 400 ? 15 : 5,
        bottom: Dimensions.get('window').width > 400 ? 10 : 5,
        position: 'absolute'
    },
});

export default ProductItem;
