import React, { useRef } from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import ImageInput from './ImageInput';


const ImageInputList = (props) => {
    //console.log("props......", props);
    const { imageUris = [], onRemoveImage, onAddImage } = props;
    const scrollVIew = useRef();

    return (
        <View>
            <ScrollView
                ref={scrollVIew}
                horizontal={true}
                onContentSizeChange={() => scrollVIew.current.scrollToEnd()}
            >
                <View style={styles.container} style={styles.image}>
                    { imageUris.map((uri) => (
                        <View   key={uri} >
                    <ImageInput
                            imageUri={uri}
                            onChangeImage={() => onRemoveImage(uri)}
                    />
                    </View>
                        ))}
                    <ImageInput onChangeImage={ uri => onAddImage(uri)} />
                </View>
            </ScrollView>
        </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flexDirection: 'row'
    },
    image:{
        marginRight:10
    }
})
export default ImageInputList;
