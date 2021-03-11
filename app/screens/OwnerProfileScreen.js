import React, {useEffect, useState} from "react";
import {View, StyleSheet,
    Text,
    Alert,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from "react-native";
import { translate } from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import * as Yup from "yup";
import {
    AppForm as Form,
    AppFormField as FormField, SubmitButton
} from "../components/forms";
import colors from "../config/colors";
import * as authActions from "../store/actions/auth";
import {Avatar, Button, Snackbar} from "react-native-paper";
import Modal from "react-native-modal";
import {updatePassword} from "../api/apiCall";
import * as ImagePicker from "expo-image-picker";

const validateUpdateSchema = Yup.object().shape({
    username: Yup.string().required().min(1).label("username"),
});

const validateSchemaPasswordChange = Yup.object().shape({
    password : Yup.string().required().min(6).label("Password"),
});

const OwnerProfileScreen = (props) => {
    const {t} = props;
    //const userData = useSelector((state) => state.auth.userData);
    const userData = props.route.params.userData;
    const initialValue = userData.username;
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const dispatch = useDispatch();
    const [imageName, setImageName] = useState('');

    const nameImageHandler = () => {
        let name = initialValue.split(" ");
        const newName = name.map((name) => name[0]).join('');
        setImageName(newName.toUpperCase());
    };

    useEffect(() => {
        nameImageHandler();
    }, []);

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t("ownerScreen:profile")
        })
    });

    const onToggleSnackBar = () => setVisible(!visible);

    const onDismissSnackBar = () => setVisible(false);

    const handlePasswordUpdate = async (values) => {
        const finalPass = {
            "password" : values.password
        }
        try{
            setLoading(true);
            await updatePassword(userData._id, finalPass)
                .then((res) => {
                    //console.log("response in updatePassword", res);
                    setLoading(false);
                    setModalVisible(false);
                    onToggleSnackBar();
                }).catch((err) => {
                    console.log("Error in updatePassword", err);
                })
            setLoading(false);
        }catch(err){
            console.log("handlePasswordChange catch", err);
            setLoading(false);
        }
    };

    const handleProfile = async (values) => {
        try {
            setLoading(true);
            await dispatch(authActions.updateProfile(imageData, values.username));
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log("Catch in OwnerProfileScreen", err);
        }
    };

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        // console.log("results", result.uri)
        if (!result.cancelled) {
            setImage(result.uri);
            setImageData(result);
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
                                <>
                                    <ActivityIndicator
                                        style={{marginTop: 10}}
                                        size={"large"}
                                        color={colors.primary}
                                    />
                                </>
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
            <View style={styles.container}>
                <TouchableOpacity onPress={pickImage} >
                    {!image &&
                        userData.profile_img === "" ?
                                <Avatar.Text style={{backgroundColor: colors.medium}} size={100} label={imageName} />
                                :
                                <>
                                    <Image
                                        style={image ? [styles.image, {borderWidth: 3, borderColor: "red"}] : styles.image}
                                        source={image ? {uri: image} : {uri: userData.profile_img}}
                                    />
                                </>
                    }
                </TouchableOpacity>
            </View>
            <Form
                initialValues={{username: userData.username}}
                onSubmit={(values) => {
                    if (values.username === initialValue && imageData === null) {
                        Alert.alert(t("ownerScreen:alert_title"), t("ownerScreen:alert_msg"), [{text: t("ownerScreen:okay")}]);
                    } else {
                        handleProfile(values).then(() => {
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
                    value={userData.phone}
                    editable={false}
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
                {loading ?
                    <>
                        <ActivityIndicator
                            style={{marginTop: 10}}
                            size={"large"}
                            color={colors.primary}
                        />
                    </>
                    :
                    <SubmitButton
                        title={t("ownerScreen:update")}
                        // disabled={!(Form.isValid && Form.dirty)}
                    />
                }
            </Form>
            <Snackbar
                visible={visible}
                duration={7000}
                onDismiss={onDismissSnackBar}
                theme={{
                    colors: {
                        onSurface: "rgb(9,222,9)",
                    },
                }}
            >
                {t("ownerScreen:toast_msg")}
            </Snackbar>
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
    },
    container:{
        marginTop: 10,
        marginBottom: 20
    },
    image:{
        height:100,
        width:100,
        borderRadius: 200
    }
});

export default translate(["ownerScreen"], {wait:true})(OwnerProfileScreen);
