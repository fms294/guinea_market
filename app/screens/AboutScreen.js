import React, {useEffect, useCallback} from "react";
import {View, StyleSheet, Linking, Alert, ImageBackground, Image, Text} from "react-native";
import {Button} from "react-native-paper";
import Constants from "expo-constants";

import colors from "../config/colors";
import {translate} from "react-i18next";

const { manifest } = Constants;

// const uri = `http://${manifest.debuggerHost
//     .split(`:`)
//     .shift()
//     .concat(`:3000`)}`;

const uri = "https://dibida.herokuapp.com";

const AboutScreen = (props) => {
    const {t} = props;

    const OpenURLButton = ({ url, children }) => {
        const handlePress = useCallback(async () => {
            // Checking if the link is supported for links with custom URL scheme.
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                await Linking.openURL(url);
            } else {
                Alert.alert(`${t("about_screen:alert")} ${url}`);
            }
        }, [url]);

        return(
            <Button
                labelStyle={{color: "blue"}}
                uppercase={false}
                onPress={handlePress}
            >{children}</Button>
        );
    };

    useEffect(() => {
        props.navigation.setOptions({
            title: props.t("about_screen:about")
        })
    })

    return(
        <ImageBackground
            style={styles.screen}
            source={require('../assets/background.jpeg')}
            blurRadius={10}
        >
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../assets/logo.png")}/>
                <Text style={styles.textDescription}>Dibida</Text>
            </View>
            <View style={styles.links}>
                <OpenURLButton url={`${uri}/about/Contact us`}>{t("about_screen:contact")}</OpenURLButton>
                <OpenURLButton url={`${uri}/about/Terms of use`}>{t("about_screen:terms")}</OpenURLButton>
                <OpenURLButton url={`${uri}/about/Privacy Policy`}>{t("about_screen:privacy")}</OpenURLButton>
                <OpenURLButton url={`${uri}/about/Publication rules`}>{t("about_screen:rules")}</OpenURLButton>
                <OpenURLButton url={`${uri}/about/Advice to users`}>{t("about_screen:advice")}</OpenURLButton>
            </View>
            <Button
                style={styles.button}
                labelStyle={{color: colors.white}}
                color={colors.primary}
                uppercase={false}
                mode={"contained"}
                onPress={() => { props.navigation.goBack() }}>{t("about_screen:okay")}</Button>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
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
    links:{
        bottom: 100,
        position: "absolute"
    },
    button:{
        width: "80%",
        bottom: 20,
        position: "absolute"
    },
});

export default translate(["about_screen"],{wait: true})(AboutScreen);
