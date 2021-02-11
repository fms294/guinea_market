import React, {useState, useEffect} from "react";
import {
    View,
    Modal,
    Alert,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet
} from "react-native";
import { translate } from 'react-i18next';
import colors from "../config/colors";
import AsyncStorage from '@react-native-community/async-storage';
import {IconButton} from "react-native-paper";

const SettingScreen = (props) => {
    const {t, i18n} = props;
    const [language, setLanguage] = useState(AsyncStorage.getItem('@APP:languageCode'));
    const [modalVisible, setModalVisible] = useState(false);

    const onChangeLang = async (lang) => {
        i18n.changeLanguage(lang);
        try {
            await AsyncStorage.setItem('@APP:languageCode',lang);
        } catch (error) {
            console.log('Language change Error...', error);
        }
        //console.log(i18n.dir());
    }

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t('setting_screen:settings')
        })
    })

    return(
        <View style={styles.screen}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{t('setting_screen:alert_msg')}</Text>

                        <TouchableOpacity
                            style={styles.openButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                onChangeLang('fr')
                                    .then((res) =>{
                                        setLanguage("fr");
                                    })
                            }}
                        >
                            <Text style={styles.textStyle}>{ t('setting_screen:french')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.openButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                onChangeLang('en')
                                    .then((res) =>{
                                        setLanguage("er");
                                    })
                            }}
                        >
                            <Text style={styles.textStyle}>{ t('setting_screen:english')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Text style={styles.text}>{t('setting_screen:lang_setting', { lng: i18n.language })}</Text>
            <IconButton
                color={colors.primary}
                icon={'translate'}
                onPress={() =>{
                    setModalVisible(true);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        margin: 20,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: 5,
    },
    text: {
        marginVertical: 10,
        fontSize: Dimensions.get('window').width > 400 ? 18 : 14,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        //backgroundColor: Colors.drawerCustom,
        //borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical:10
    },
    textStyle: {
        color: colors.primary,
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 20
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20
    }
});

export default translate(['setting_screen'],{wait: true})(SettingScreen);
