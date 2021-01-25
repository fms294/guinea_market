import React, {useEffect} from "react";
import {View, Image, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";
import {useDispatch} from "react-redux";

import * as authActions from "../store/actions/auth";

const StartupScreen = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const storedUserData = await AsyncStorage.getItem("userData");
            const userDataJSON = JSON.parse(storedUserData);

            if(!storedUserData) {
                dispatch(authActions.restoreToken(null,null));
                return;
            }
            const {token, userData} = userDataJSON;
            dispatch(authActions.restoreToken(token, userData));
        }
        tryLogin();
    });

    return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image style={styles.logo} source={require("../assets/logo.png")}/>
        </View>
    );
}

const styles = StyleSheet.create({
    logo:{
        width:100,
        height:100 ,
        borderRadius:200
    },
});

export default StartupScreen;
