import React, { useState, useEffect } from "react";
import {View, StyleSheet, Picker, Text, ScrollView, Image, TouchableOpacity, Alert} from "react-native";
import * as Yup from "yup";
import * as ImagePicker from 'expo-image-picker';
import {Button} from "react-native-paper";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  AppForm as Form,
  AppFormField as FormField,
  AppFormPicker as FormPicker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/FormImagePicker";
import UploadScreen from "./UploadScreen";
import {categories, regions} from "../data/data";
import * as listingAction from "../store/actions/listing";
import { useDispatch } from "react-redux";
import {translate} from "react-i18next";
import colors from "../config/colors";

const phoneRegEx = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label("Title"),
    price: Yup.number().required().min(1).label("Price"),
    description: Yup.string().required().label("Description"),
    //category: Yup.object().required().nullable().label("Category"),
    phone: Yup.string().required().matches(phoneRegEx, 'Phone number is not valid').label("Phone"),
    //images: Yup.array().min(1,"Please select at list one image").label("Images")
});

const ListingEditScreen = (props) => {
    const {t} = props;
    const dispatch = useDispatch();

    //const location = useLocation();
    //console.log("location", location);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [progress, setProgress] = useState(0);
    const [category, setCategory] = useState();
    const [region, setRegion] = useState("Conakry");

    // useEffect(() => {
    //     const params = props.route.params;
    //     if(params) {
    //         const photos = params.photos;
    //         if(photos) {
    //             setImage(photos);
    //         }
    //         delete params.photos;
    //     }
    // })

    useEffect(() => {
        props.navigation.setOptions({
            headerShown: false
        })
    })

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
            // allowsMultipleSelection: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
            setImageData(result);
        }
    };

    const handleSubmission = async (values) => {
       //console.log("values.....", values);
        const finalData = {
            "title": values.title,
            "price": values.price,
            "description": values.description,
            "main_category": values.category,
            "sub_category" : "",
            "region": region,
            "contact_phone": values.phone,
            "images" : [{imageData},{imageData}]
        }
        console.log("FinalData", finalData);
        if(imageData === null){
            Alert.alert(t("listing_add:alert_title"),t("listing_add:alert_msg"), [{text: t("listing_add:okay")}])
        }else{
            await dispatch(listingAction.add_item(finalData));
        }
    }

    // const renderImage = (item, i) => {
    //     return (
    //         <Image
    //             style={{ height: 100, width: 100 }}
    //             source={{ uri: item.uri }}
    //             key={i}
    //         />
    //     )
    // }

    return (
          <ScrollView>
              <Screen style={styles.container}>
                  <UploadScreen
                      onDone={() => setUploadVisible(false)}
                      progress={progress}
                      visible={uploadVisible}
                  />
                  <Form
                      initialValues={{
                          title: "",
                          price: "",
                          description: "",
                          category: null,
                          phone:"",
                          //images:[]
                      }}
                      onSubmit={(values, {resetForm}) => {
                          handleSubmission(values).then(() => {
                              if(image !== null){
                                  resetForm({values : ''})
                                  setRegion("Conakry");
                                  setImage(null);
                              }
                          })
                      }}
                      validationSchema={validationSchema}
                  >
                      {/*<FormImagePicker*/}
                      {/*    name="Images"*/}
                      {/*/>*/}

                      <TouchableOpacity style={styles.imageContainer} onPress={pickImage} >
                          {!image && <MaterialCommunityIcons color={colors.medium} name="camera" size={40} />}
                          {image && <Image source={{ uri: image }} style={styles.image} />}
                      </TouchableOpacity>

                      {/*<TouchableOpacity*/}
                      {/*    style={styles.imageContainer}*/}
                      {/*    onPress={() => props.navigation.navigate("ImageBrowserScreen")}*/}
                      {/*>*/}
                      {/*    <MaterialCommunityIcons color={colors.medium} name="camera" size={40} />*/}
                      {/*</TouchableOpacity>*/}
                      {/*<ScrollView>*/}
                      {/*    {image.map((item, i) => {*/}
                      {/*        renderImage(item, i)*/}
                      {/*    })}*/}
                      {/*</ScrollView>*/}
                      <FormField
                          maxLength={255}
                          name="title"
                          placeholder={t("listing_add:title")}
                      />
                      <FormField
                          keyboardType="numeric"
                          maxLength={8}
                          name="price"
                          placeholder={t("listing_add:price")}
                      />
                      <FormField
                          maxLength={255}
                          multiline
                          name="description"
                          numberOfLines={3}
                          placeholder={t("listing_add:desc")}
                      />
                      <FormField
                          keyboardType="numeric"
                          maxLength={10}
                          name="phone"
                          placeholder={t("listing_add:contact")}
                      />
                      <FormPicker
                          items={categories}
                          //numberOfColumns={1}
                          name="category"
                          PickerItemComponent={CategoryPickerItem}
                          placeholder={t("listing_add:category")}
                      />
                      {/*<Text style={styles.text}>Select Category</Text>*/}
                      {/*<Picker*/}
                      {/*    name={categories}*/}
                      {/*    selectedValue={category}*/}
                      {/*    style={styles.picker}*/}
                      {/*    mode={"modal"}*/}
                      {/*    onValueChange={(itemValue) => setCategory(itemValue)}*/}
                      {/*>*/}
                      {/*      {categories.map((item, index) => {*/}
                      {/*          //console.log("cat", item);*/}
                      {/*          if(item.sub_category === undefined) {*/}
                      {/*              //console.log("main", item.category);*/}
                      {/*              //return <Picker.Item value={item.category} label={item.category} key={index}/>*/}
                      {/*          }else {*/}
                      {/*              //console.log("sub main", item.category);*/}
                      {/*              item.sub_category.map((itemInner, indexInner) => {*/}
                      {/*                  //console.log("sub", item);*/}
                      {/*                  return <Picker.Item value={itemInner} label={item.category + itemInner} key={indexInner}/>*/}
                      {/*              })*/}
                      {/*          }*/}
                      {/*      })}*/}
                      {/*</Picker>*/}
                      <Text style={styles.text}>{t("listing_add:select")}</Text>
                      <View style={styles.pickerContainer}>
                          <Picker
                              name={regions}
                              selectedValue={region}
                              style={styles.picker}
                              mode={"modal"}
                              onValueChange={(itemValue) => setRegion(itemValue)}
                          >
                              {regions.map( (s,i) => {
                                  return <Picker.Item value={s} label={s} key={i}/>
                              })}
                          </Picker>
                      </View>
                      <SubmitButton title={t("listing_add:btn")}/>
                  </Form>
              </Screen>
          </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    pickerContainer: {
        //flex: 1,
        //width: '100%',
        alignItems: 'center',
    },
    text: {
        marginLeft: 20,
        //marginVertical: 5,
        fontSize: 20,
        color: colors.medium
    },
    picker: {
        width: '70%',
    },
    imageContainer:{
        alignItems:'center',
        backgroundColor: colors.light,
        borderRadius:15,
        height:100,
        justifyContent:'center',
        overflow:'hidden',
        width:100

    },
    image:{
        height:100,
        width:100
    }
});

export default translate(["listing_add"], {wait: true})(ListingEditScreen);
