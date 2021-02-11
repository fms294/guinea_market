import React, {useEffect, useState} from 'react';
import {
    ImageBackground,
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Alert
} from 'react-native';
import Modal from "react-native-modal";
import colors from "../config/colors";
import {
    AppForm as Form,
    AppFormField as FormField,
    ErrorMessage,
    SubmitButton
} from "../components/forms";
import {Formik} from 'formik';
import * as Yup from "yup";
import * as authActions from "../store/actions/auth";
import {useDispatch} from "react-redux";
import {forgetPassword, updatePassword} from "../api/apiCall";
import {translate} from "react-i18next";

const WelcomeScreen = (props) => {
    const {t} = props;
    const [title, setTitle] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [forgetView, setForgetView] = useState(false);
    const [otpView, setOtpView] = useState(false);
    const [serverOtp, setServerOtp] = useState();
    const [serverId, setServerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [updatePasswordView, setUpdatePasswordView] = useState(false);
    const dispatch = useDispatch();

    const validationSchemaLogin = Yup.object().shape({
        //email: Yup.string().required().email().label("Email"),
        phone: Yup.string().required().matches(/^\d{9}$/, {message: t("welcome_screen:error_phone_msg")}),
        password: Yup.string().required().min(6).label("Password"),
    });

    const validationSchemaRegister = Yup.object().shape({
        name: Yup.string().required().label("Name"),
        //email: Yup.string().required().email().label("Email"),
        phone: Yup.string().required().matches(/^\d{9}$/, {message: t("welcome_screen:error_phone_msg")}),
        password: Yup.string().required().min(6).label("Password"),
        confirmPassword: Yup.string().label("Password Confirm").required()
            .oneOf([Yup.ref('password')], 'Confirm Password must matched Password'),
    });

    const validationSchemaHandleOtp = Yup.object().shape({
        phone: Yup.string().required().matches(/^\d{9}$/, {message: t("welcome_screen:error_phone_msg")})
    });

    const validationSchemaConfirmOtp = Yup.object().shape({
        otp : Yup.number().required().min(4).label("OTP"),
    });

    const validateSchemaPasswordChange = Yup.object().shape({
        password : Yup.string().required().min(6).label("Password"),
    });

    const handleOTP = async (values) => {
        try{
            setLoading(true);
            await forgetPassword(values)
                .then((res) => {
                setServerOtp(res.data.otp);
                setServerId(res.data.user._id);
                setOtpView(true);
                    setLoading(false);
                // console.log("Forget..res", res.data.otp);
                // console.log("Forget..res...", serverOtp);
            }).catch((err) => {
                console.log("Forget..err", err);
                Alert.alert(t("welcome_screen:handle_alert"), t("welcome_screen:handle_alert_msg"),
                    [{
                        text : t("welcome_screen:create_acc"),
                        style: 'destructive',
                        onPress: () =>{
                            setTitle(t("welcome_screen:register"))
                        }},
                        {
                            text: t("welcome_screen:try_again"),
                            style: 'cancel'
                        }
                    ])
            })
            setLoading(false);
        }catch(err) {
            console.log("Forget..catch", err);
            setLoading(false);
        }
    }

    const handleConfirmOTP = async (values) => {
        //console.log("confirm otp",values.otp);
        //console.log("confirm otp...",serverOtp);
        if(parseInt(serverOtp) === parseInt(values.otp)){
            //console.log("Matched");
            setUpdatePasswordView(true);
        }else{
            console.log("Wrong Otp");
            Alert.alert(t("welcome_screen:confirmOtp_alert"), t("welcome_screen:confirmOtp_alert_msg"), [{text: t("welcome_screen:retry")}]);
        }
    }

    const handlePasswordChange = async (values) => {
        console.log("password change update", values.password);
        console.log("serverId", serverId);
        const finalPass = {
            "password" : values.password
        }
        try{
            setLoading(true);
            await updatePassword(serverId, finalPass)
                .then((res) => {
                    //console.log("response in updatePassword", res);
                    setTitle(t("welcome_screen:login"))
                    setErrorMessage("");
                    setForgetView(false);
                    setOtpView(false);
                    setUpdatePasswordView(false);
                    setLoading(false);
                }).catch((err) => {
                    console.log("Error in updatePassword", err);
                })
            setLoading(false);
        }catch(err){
            console.log("handlePasswordChange catch", err);
            setLoading(false);
        }
    }

    const handleSubmission = async (values) => {
        //console.log("events...", values);
        try {
            if(title === t("welcome_screen:register")){
                await dispatch(authActions.signup(values.name, values.phone, values.password));
            }else {
                await dispatch(authActions.login(values.phone, values.password));
            }
            setLoginFailed(false);
        } catch (error) {
            setLoginFailed(true);
            setErrorMessage(error.message);
            console.log(error);
        }
    }

    return (
        <ImageBackground
            blurRadius={10}
            style={styles.background}
            source={require('../assets/background.jpeg')}
        >
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
                        {title === t("welcome_screen:login") ? (
                            <>
                                {forgetView ? (
                                    <>
                                        {otpView ? (
                                            <>
                                                {updatePasswordView ? (
                                                    <>
                                                        <Text style={styles.modalText}>{t("welcome_screen:update_pass_title")}</Text>
                                                        <Form
                                                            initialValues={{password: ""}}
                                                            onSubmit={(values) => handlePasswordChange(values)}
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
                                                    </>
                                                ) : (
                                                    <>
                                                        <Text style={styles.modalText}>OTP</Text>
                                                        <Form
                                                            initialValues={{otp: ""}}
                                                            onSubmit={(values) => handleConfirmOTP(values)}
                                                            validationSchema={validationSchemaConfirmOtp}
                                                        >
                                                            <FormField
                                                                icon="phone"
                                                                keyboardType="decimal-pad"
                                                                name='otp'
                                                                placeholder={t("welcome_screen:enter_otp")}
                                                                textContentType="oneTimeCode"
                                                            />
                                                            <SubmitButton title={t("welcome_screen:confirm_otp")}/>
                                                        </Form>
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                <Text style={styles.modalText}>{t("welcome_screen:forget_title")}</Text>
                                                <Form
                                                    initialValues={{ phone : ""}}
                                                    onSubmit={(values) => handleOTP(values)}
                                                    validationSchema={validationSchemaHandleOtp}
                                                >
                                                    <FormField
                                                        icon={"phone"}
                                                        keyboardType={"decimal-pad"}
                                                        name={"phone"}
                                                        placeholder={t("welcome_screen:phone")}
                                                    />
                                                    {loading ? (
                                                        <SubmitButton title={t("welcome_screen:loading")} />
                                                    ) : (
                                                        <SubmitButton title={t("welcome_screen:req_otp")}/>
                                                    )}
                                                </Form>
                                            </>
                                        )}
                                        </>
                                ) : (
                                    <>
                                        <Text style={styles.modalText}>{title}</Text>
                                        <Image
                                            style={styles.logo}
                                            source={require('../assets/logo.png')}
                                        />
                                        <Form
                                            initialValues={{phone: "", password: ""}}
                                            onSubmit={(values) => handleSubmission(values)}
                                            validationSchema={validationSchemaLogin}
                                        >
                                            <ErrorMessage error={errorMessage} visible={loginFailed}/>
                                            <FormField
                                                icon={"phone"}
                                                keyboardType={"decimal-pad"}
                                                name={"phone"}
                                                placeholder={t("welcome_screen:phone")}
                                            />
                                            <FormField
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                icon="lock"
                                                name="password"
                                                placeholder={t("welcome_screen:pass")}
                                                secureTextEntry
                                                textContentType="password"
                                            />
                                            <SubmitButton title={t("welcome_screen:login")}/>
                                        </Form>
                                        <TouchableOpacity
                                            style={styles.openButtonForget}
                                            onPress={() => {
                                                //Alert.alert("Warning", "Feature Yet to be Implemented", [{text: "Okay"}])
                                                setForgetView(true);
                                                setOtpView(false);
                                            }}
                                        >
                                            <Text style={styles.textStyleForget}>{t("welcome_screen:forget_pass")}</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.openButton}
                                            onPress={() => {
                                                setTitle(t("welcome_screen:register"))
                                                setErrorMessage("");
                                            }}
                                        >
                                            <Text style={styles.textStyle}>{t("welcome_screen:new_acc")}</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                            <Text style={styles.modalText}>{title}</Text>
                            <Formik
                                initialValues={{ name: "", phone: "", password: "", confirmPassword: ""}}
                                onSubmit={(values) => handleSubmission(values)}
                                validationSchema={validationSchemaRegister}
                            >{({
                                handleChange,
                                values,
                                errors,
                                touched,
                                handleBlur,
                            }) => (
                                <>
                                    <ErrorMessage
                                        errorValue={touched.confirmPassword && errors.confirmPassword}
                                        error={errorMessage}
                                        visible={loginFailed}
                                    />
                                    <FormField
                                        autoCorrect={false}
                                        icon="account"
                                        name="name"
                                        placeholder={t("welcome_screen:name")}
                                    />
                                    <FormField
                                        icon={"phone"}
                                        keyboardType={"decimal-pad"}
                                        name={"phone"}
                                        placeholder={t("welcome_screen:phone")}
                                        //textContentType={""}
                                    />
                                    <FormField
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        icon="lock"
                                        name="password"
                                        placeholder={t("welcome_screen:pass")}
                                        secureTextEntry
                                        textContentType="password"
                                    />
                                    <FormField
                                        name="password"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange("confirmPassword")}
                                        placeholder={t("welcome_screen:conf_pass")}
                                        secureTextEntry
                                        icon="lock"
                                        onBlur={handleBlur("confirmPassword")}
                                        textContentType="password"
                                    />
                                    <SubmitButton title={t("welcome_screen:register")} />
                                    <TouchableOpacity
                                        style={styles.openButton}
                                        onPress={() => {
                                            setTitle(t("welcome_screen:login"))
                                            setErrorMessage("");
                                            setForgetView(false);
                                            setOtpView(false);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>{t("welcome_screen:already")}</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                            </Formik>
                        </>)}

                        <TouchableOpacity
                            style={styles.openButton}
                            onPress={() => {
                                setModalVisible(!modalVisible);
                                setErrorMessage("");
                                setForgetView(false);
                                setOtpView(false);
                                setUpdatePasswordView(false);
                            }}
                        >
                            <Text style={styles.textStyle}>{t("welcome_screen:cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.logoContainer}>
                {modalVisible ? <></> :
                    <>
                       <Image style={styles.logo} source={require("../assets/logo.png")}/>
                        <Text style={styles.textDescription}>Dibida</Text>
                    </>
                }
            </View>
            <View style={styles.buttonsContainer}>
                {modalVisible ? <></> : <><TouchableOpacity style={[styles.button,
                    {backgroundColor: colors.primary}]}
                                   onPress={() => {
                                       setTitle(t("welcome_screen:login"))
                                       setModalVisible(true)
                                   }}>
                    <Text style={styles.text}>{t("welcome_screen:login")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,
                    { backgroundColor: colors.primary} ]}
                                  onPress={() => {
                                      setTitle(t("welcome_screen:register"))
                                      setModalVisible(true)
                                  }}>
                    <Text style={styles.text}>{t("welcome_screen:register")}</Text>
                </TouchableOpacity></>}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background:{
        flex:1,
        justifyContent:"flex-end",
        alignItems: "center"
    },
    buttonsContainer:{
        padding:20,
        width:"100%",
    },
    logo:{
        width:100,
        height:100 ,
        borderRadius:200
    },
    logoContainer:{
        position:"absolute",
        top:70,
        paddingVertical:20,
        alignItems:"center"

    },
    textDescription:{
        fontSize:50,
        fontWeight:"bold",
        marginTop: 10,
        color: colors.medium,
        //fontStyle: "italic"
    },
    button:{
        backgroundColor: colors.primary,
        borderRadius:25,
        justifyContent:"center",
        alignItems: "center",
        padding:15,
        width:"100%",
        marginVertical:10
    },
    text:{
        color: colors.white,
        fontSize:18,
        textTransform:"uppercase",
        fontWeight:"bold"
    },
    screen: {
        margin: 20,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
        // borderWidth: 1,
        // borderColor: "#ccc",
        // borderRadius: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        // alignItems: "center",
        marginTop: 22
    },
    modalView: {
        //margin: 20,
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
    openButtonForget: {
        marginTop: 5
    },
    openButton: {
        marginTop: 20
    },
    textStyleForget: {
        color: 'red',
        //fontWeight: "bold",
        //textAlign: "right",
        fontSize: 15
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
    }
})

export default translate(["welcome_screen"], {wait: true})(WelcomeScreen);
