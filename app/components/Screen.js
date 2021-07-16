import React from 'react';
import Constants from 'expo-constants';
import {SafeAreaView, StyleSheet, View} from 'react-native';

const Screen = (props) => {
    return(
        <SafeAreaView style={[styles.screen, props.style ]}>
            <View style={[styles.view, props.style]}>
                {props.children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    screen:{
        paddingTop: Constants.statusBarHeight,
        flex:1
    },
    view:{
        flex:1,
    }
})

export default Screen;
