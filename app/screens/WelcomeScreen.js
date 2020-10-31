import React from 'react';
import { ImageBackground , StyleSheet, View,Image, Text} from 'react-native';
import AppButton from '../components/Button';

function WelcomeScreen({navigation}){
    return (
        <ImageBackground
            blurRadius={10}
            style={styles.background}
            source={require('../assets/background.jpeg')}
        >   
            <View style={styles.logoContainer}>
                <Image style={styles.logo} source={require("../assets/logo.png")}/>
                <Text style={styles.textDescription}>Guinea Market </Text>
            </View>
            <View style={styles.buttonsContainer}>
                <AppButton title="Login" onPress={() => navigation.navigate("Login")}/>
                <AppButton title="Register" color="secondary" onPress={() => navigation.navigate("Register")}/>
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
    }
   
})

export default WelcomeScreen;