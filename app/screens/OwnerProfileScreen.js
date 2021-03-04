import React, {useEffect, useState} from "react";
import {View, StyleSheet, Text, Alert, TouchableOpacity} from "react-native";
import { translate } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import * as Yup from "yup";

import {
    AppForm as Form,
    AppFormField as FormField, SubmitButton
} from "../components/forms";
import colors from "../config/colors";
import * as authActions from "../store/actions/auth";
import {Button} from "react-native-paper";
import {Formik} from "formik";
import Modal from "react-native-modal";
import {updatePassword} from "../api/apiCall";

const validateUpdateSchema = Yup.object().shape({
    username: Yup.string().required().min(1).label("username"),
});

const validateSchemaPasswordChange = Yup.object().shape({
    password : Yup.string().required().min(6).label("Password"),
});

const OwnerProfileScreen = (props) => {
    const {t} = props;
    const userData = useSelector((state) => state.auth.userData);
    const initialValue = userData.username;
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t("ownerScreen:profile")
        })
    });

    const updateProfile = async (values) => {
        try {
            await dispatch(authActions.updateProfile(values.username));
        } catch (err) {
            console.log("Catch in OwnerProfileScreen", err);
        }
    };

    const handlePasswordUpdate = async (values) => {
        const finalPass = {
            "password" : values.password
        }
        try{
            setLoading(true);
            await updatePassword(userData.userId, finalPass)
                .then((res) => {
                    //console.log("response in updatePassword", res);
                    setLoading(false);
                    setModalVisible(false);
                }).catch((err) => {
                    console.log("Error in updatePassword", err);
                })
            setLoading(false);
        }catch(err){
            console.log("handlePasswordChange catch", err);
            setLoading(false);
        }
    };

    return(
        <View style={styles.screen}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>{t("ownerScreen:change_pass")}</Text>
                        <Form
                            initialValues={{password: ""}}
                            onSubmit={(values) => handlePasswordUpdate(values)}
                            validationSchema={validateSchemaPasswordChange}
                        >
                            <FormField
                                autoCapitalize="none"
                                autoCorrect={false}
                                icon="lock"
                                name="password"
                                placeholder={t("welcome_screen:new_pass")}
                                secureTextEntry
                                textContentType="password"
                            />
                            {loading ? (
                                <SubmitButton title={t("welcome_screen:loading")} />
                            ) : (
                                <SubmitButton title={t("welcome_screen:update_pass")}/>
                            )}
                        </Form>
                        <TouchableOpacity
                            style={styles.openButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>{t("welcome_screen:cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Form
                initialValues={{username: userData.username}}
                onSubmit={(values) => {
                    if (values.username === initialValue) {
                        Alert.alert(t("ownerScreen:alert_title"), t("ownerScreen:alert_msg"), [{text: t("ownerScreen:okay")}]);
                    } else {
                        updateProfile(values).then(() => {
                            props.navigation.navigate("AccountScreen");
                        })
                    }
                }}
                validationSchema={validateUpdateSchema}
            >
                <FormField
                    icon={"account"}
                    name={"username"}
                    placeholder={t("ownerScreen:username")}
                />
                <FormField
                    icon={"phone"}
                    value={userData.userPhone}
                    editable={false}
                    color={colors.medium}
                />
                <Button
                    style={styles.button}
                    labelStyle={{fontSize: 15}}
                    color={colors.primary}
                    uppercase={false}
                    mode={"outlined"}
                    onPress={() => {
                        setModalVisible(true);
                    }}
                >{t("ownerScreen:change_pass")}</Button>
                <SubmitButton
                    title={t("ownerScreen:update")}
                    // disabled={!(Form.isValid && Form.dirty)}
                />
            </Form>
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        alignItems: "center",
        marginHorizontal: 50,
        marginVertical: 20
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        paddingHorizontal: 50,
        paddingVertical: 35,
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
    textStyle: {
        color: colors.primary,
        textAlign: "center",
        fontSize: 20
    },
    modalText: {
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: "center",
        fontSize: 30,
        color: colors.primary
    },
    button:{
        marginVertical: 10
    }
});

export default translate(["ownerScreen"], {wait:true})(OwnerProfileScreen);
