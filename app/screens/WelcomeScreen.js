import React, {Fragment, useEffect, useState} from 'react';
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
import AppButton from '../components/Button';
import colors from "../config/colors";
import {
    AppForm as Form,
    AppFormField as FormField,
    ErrorMessage,
    SubmitButton
} from "../components/forms";
import {Formik} from 'formik';
import * as Yup from "yup";
import Screen from "../components/Screen";
import * as authActions from "../store/actions/auth";
import routes from "../navigation/routes";
import {useFormikContext} from "formik";
import {useDispatch} from "react-redux";
import {forgetPassword, updatePassword} from "../api/apiCall";
import {ActivityIndicator} from "react-native-web";

const validationSchemaLogin = Yup.object().shape({
    //email: Yup.string().required().email().label("Email"),
    phone: Yup.string().required().matches(/^\d{9}$/, {message: "Enter Valid Phone Number"}),
    password: Yup.string().required().min(6).label("Password"),
});

const validationSchemaRegister = Yup.object().shape({
    name: Yup.string().required().label("Name"),
    //email: Yup.string().required().email().label("Email"),
    phone: Yup.string().required().matches(/^\d{9}$/, {message: "Enter Valid Phone Number"}),
    password: Yup.string().required().min(6).label("Password"),
    confirmPassword: Yup.string().label("Password Confirm").required()
        .oneOf([Yup.ref('password')], 'Confirm Password must matched Password'),
});

const validationSchemaHandleOtp = Yup.object().shape({
    email: Yup.string().required().email().label("Registered Email"),
});

const validationSchemaConfirmOtp = Yup.object().shape({
    otp : Yup.number().required().min(4).label("OTP"),
});

const validateSchemaPasswordChange = Yup.object().shape({
    password : Yup.string().required().min(6).label("Password"),
})

const WelcomeScreen = ({navigation}) => {
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
    let serverOtptemp;

    useEffect(() => {
        navigation.setOptions({
            title: "Welcome"
        })
    });

    const handleOTP = async (values) => {
        try{
            setLoading(true);
            await forgetPassword(values)
                .then((res) => {
                serverOtptemp = res.data.otp;
                setServerOtp(serverOtptemp);
                setServerId(res.data.user._id);
                setOtpView(true);
                    setLoading(false);
                console.log("Forget..res", serverOtptemp);
                console.log("Forget..res...", serverOtp);
            }).catch((err) => {
                console.log("Forget..err", err);
                Alert.alert("User doesn't Exists", "Please register yourself first..!!",
                    [{
                        text : 'Create Account',
                        style: 'destructive',
                        onPress: () =>{
                            setTitle("Register");
                        }},
                        {
                            text: 'Try Again',
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
        console.log("confirm otp",values.otp);
        console.log("confirm otp...",serverOtp);
        if(parseInt(serverOtp) === parseInt(values.otp)){
            console.log("Matched");
            setUpdatePasswordView(true);
        }else{
            console.log("Wrong Otp");
            Alert.alert("Wrong OTP", "You entered the incorrect OTP", [{text: "Retry"}]);
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
                    setTitle("Login");
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
            if(title === "Register"){
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
                        {title === "Login" ? (
                            <>
                                {forgetView ? (<>
                                    {otpView ? (
                                        <>
                                            {updatePasswordView ? (
                                                <>
                                                    <Text style={styles.modalText}>Update Your Password</Text>
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
                                                            placeholder="New Password"
                                                            secureTextEntry
                                                            textContentType="password"
                                                        />
                                                        {loading ? (
                                                            <SubmitButton title="Loading..."/>
                                                        ) : (
                                                            <SubmitButton title="Update Password"/>
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
                                                            placeholder="Enter OTP"
                                                            textContentType="oneTimeCode"
                                                        />
                                                        <SubmitButton title="Confirm OTP"/>
                                                    </Form>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <Text style={styles.modalText}>Forget Password</Text>
                                            <Form
                                                initialValues={{email: ""}}
                                                onSubmit={(values) => handleOTP(values)}
                                                validationSchema={validationSchemaHandleOtp}
                                            >
                                            <FormField
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                icon="email"
                                                keyboardType="email-address"
                                                name='email'
                                                placeholder="Email"
                                                textContentType="emailAddress"
                                            />
                                                {loading ? (
                                                    <SubmitButton title="Loading..."/>
                                                ) : (
                                                    <SubmitButton title="Request OTP"/>
                                                )}
                                            </Form>
                                        </>
                                    )}
                                </>) : (
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
                                                placeholder={"Phone No."}
                                                // autoCapitalize="none"
                                                // autoCorrect={false}
                                                // icon="email"
                                                // keyboardType="email-address"
                                                // name='email'
                                                // placeholder="Email"
                                                // textContentType="emailAddress"
                                            />
                                            <FormField
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                icon="lock"
                                                name="password"
                                                placeholder="Password"
                                                secureTextEntry
                                                textContentType="password"
                                            />
                                            <SubmitButton title="Login"/>
                                        </Form>
                                        <TouchableOpacity
                                            style={styles.openButtonForget}
                                            onPress={() => {
                                                setForgetView(true);
                                                setOtpView(false);
                                            }}
                                        >
                                            <Text style={styles.textStyleForget}>Forget Password ?</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.openButton}
                                            onPress={() => {
                                                setTitle("Register");
                                                setErrorMessage("");
                                            }}
                                        >
                                            <Text style={styles.textStyle}>Register New Account</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </>
                        ) : (<>
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
                                        placeholder="Name"
                                    />
                                    <FormField
                                        icon={"phone"}
                                        keyboardType={"decimal-pad"}
                                        name={"phone"}
                                        placeholder={"Phone No."}
                                        //textContentType={""}
                                    />
                                    <FormField
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        icon="lock"
                                        name="password"
                                        placeholder="Password"
                                        secureTextEntry
                                        textContentType="password"
                                    />
                                    <FormField
                                        name="password"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange("confirmPassword")}
                                        placeholder="Confirm password"
                                        secureTextEntry
                                        icon="lock"
                                        onBlur={handleBlur("confirmPassword")}
                                        textContentType="password"
                                    />
                                    <SubmitButton title="Register"/>
                                    <TouchableOpacity
                                        style={styles.openButton}
                                        onPress={() => {
                                            setTitle("Login");
                                            setErrorMessage("");
                                            setForgetView(false);
                                            setOtpView(false);
                                        }}
                                    >
                                        <Text style={styles.textStyle}>Already Registered</Text>
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
                            <Text style={styles.textStyle}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.logoContainer}>
                {modalVisible ? <></> :
                    <>
                       <Image style={styles.logo} source={require("../assets/logo.png")}/>
                        <Text style={styles.textDescription}>Guinea Market </Text>
                    </>
                }
            </View>
            <View style={styles.buttonsContainer}>
                {modalVisible ? <></> : <><TouchableOpacity style={[styles.button,
                    {backgroundColor: colors.primary}]}
                                   onPress={() => {
                                       setTitle("Login")
                                       setModalVisible(true)
                                   }}>
                    <Text style={styles.text}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button,
                    { backgroundColor: colors.primary} ]}
                                  onPress={() => {
                                      setTitle("Register")
                                      setModalVisible(true)
                                  }}>
                    <Text style={styles.text}>Register</Text>
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
        fontSize:25,
        fontWeight:"bold",
        fontStyle: "italic"
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

export default WelcomeScreen;
