import React from 'react';
import  {View ,StyleSheet, TextInput, Image} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import defaultStyles from '../config/styles'

const AppTextInput = ({icon, ...otherProps}) => {

    const ICON = () => {
        return (
            <View style={styles.containerOne}>
                <Image
                    source={require('../assets/Flag_Guinea.png')}
                    style={{ width: 20, height: 15 , marginRight: 10}}
                />
            </View>
        );
    }

    return(
        <View style={styles.container}>
            {icon === "phone" ? <>{ICON()}</> :
                <>
                    <MaterialCommunityIcons
                        name={icon} size={20}
                        color={defaultStyles.colors.medium}
                        style={styles.icon}/>
                </>
            }
            <TextInput
                placeholderTextColor={defaultStyles.colors.medium}
                style={defaultStyles.text} {...otherProps}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        backgroundColor: defaultStyles.colors.light,
        borderRadius:25,
        flexDirection:"row",
        width:'100%',
        padding:15,
        marginVertical:10
    },
    icon:{
        marginRight:10
    },
    containerOne: {
        justifyContent: 'center',
    },
})

export default AppTextInput;
