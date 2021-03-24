import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    Picker,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    ActivityIndicator
} from "react-native";
import * as Yup from "yup";
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  AppForm as Form,
  AppFormField as FormField,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import UploadScreen from "./UploadScreen";
import {categories, prefectures} from "../data/data";
import * as listingAction from "../store/actions/listing";
import { useDispatch } from "react-redux";
import {translate} from "react-i18next";
import colors from "../config/colors";

const phoneRegEx = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label("Title"),
    price: Yup.number().required().min(1).label("Price"),
    description: Yup.string().required().label("Description"),
    phone: Yup.string().required().matches(phoneRegEx, 'Phone number is not valid').label("Phone"),
    //images: Yup.array().min(1,"Please select at list one image").label("Images")
});

const ListingEditScreen = (props) => {
    const {t} = props;
    const dispatch = useDispatch();
    // const [uploadVisible, setUploadVisible] = useState(false);
    // const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [category, setCategory] = useState("Vehicles");
    const [sub_category, setSub_category] = useState("Cars");
    const [prefecture, setPrefecture] = useState("Conakry");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const {params} = props.route;
        if (params) {
            const {photos} = params;
            if (photos) {
                let arr = [];
                photos.map((item) => {
                    arr.push(item.uri);
                });
                setImage(arr);
                setImageData(photos);
            }
            delete params.photos;
        }
    });

    useEffect(() => {
        props.navigation.setOptions({
            headerShown: false
        })
    })

    useEffect(() => {
        (async () => {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(t("listing_add:alert"),'Sorry, we need camera roll permissions to make this work!', [{text: t("listing_add:okay")}]);
                }
        })();
    }, []);

    const handleImage = () => {
        props.navigation.navigate("ImageBrowserScreen", {from: "Edit"});
    };

    // const pickImage = async () => {
    //     let result = await ImagePicker.launchImageLibraryAsync({
    //         mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //         allowsEditing: true,
    //         // allowsMultipleSelection: true,
    //         aspect: [4, 3],
    //         quality: 1,
    //     });
    //
    //     if (!result.cancelled) {
    //         setImage(result.uri);
    //         setImageData(result);
    //     }
    // };

    const resDataGenerator = (values) => {
        const finalData = {
            "title": values.title,
            "price": values.price,
            "description": values.description,
            "main_category": category,
            "sub_category" : sub_category,
            "prefecture": prefecture,
            "contact_phone": values.phone,
            "images" : imageData
            // "images" : [{imageData},{imageData}]
        }
        return finalData;
    };

    const handleSubmission = async (values) => {
       //console.log("values.....", values);
        const final = resDataGenerator(values);
        console.log("FinalData...",final);
        if(imageData === null){
            Alert.alert(t("listing_add:alert_title"),t("listing_add:alert_msg"), [{text: t("listing_add:okay")}])
        }else{
            await dispatch(listingAction.add_item(final));
        }
    }

    return (
          <ScrollView>
              <Screen style={styles.container}>
                  {/*<UploadScreen*/}
                  {/*    onDone={() => setUploadVisible(false)}*/}
                  {/*    progress={progress}*/}
                  {/*    visible={uploadVisible}*/}
                  {/*/>*/}
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
                          const array = ["Vehicles", "Immovable", "Electronic", "Construction", "Education", "Furniture", "Food", "Job", "Health", "Services"];
                          const default_sub = ["Cars", "Trucks"];
                          if(array.includes(category)) {
                              if(category !== "Vehicles" && sub_category === "Cars"){
                                  Alert.alert(t("listing_add:alert"),t("listing_add:alert_sub_category"), [{text: t("listing_add:okay")}]);
                              } else if(category === "Vehicles" && default_sub.includes(sub_category) === false) {
                                  Alert.alert(t("listing_add:alert"),t("listing_add:alert_sub_category"), [{text: t("listing_add:okay")}]);
                              } else if(sub_category === "") {
                                  Alert.alert(t("listing_add:alert"),t("listing_add:alert_sub_category"), [{text: t("listing_add:okay")}]);
                              } else {
                                  setLoading(true);
                                  handleSubmission(values).then(() => {
                                      console.log(image)
                                      if(image !== null){
                                          resetForm({values : ''})
                                          setPrefecture("Conakry");
                                          setCategory("Vehicles");
                                          setSub_category("Cars");
                                          setImage(null);
                                      }
                                      setLoading(false);
                                  }).catch((err) => {
                                      setLoading(false);
                                      console.log("catch... in onSubmit", err);
                                  });
                              }
                          }else {
                              setLoading(true);
                              handleSubmission(values).then(() => {
                                  if(image !== null){
                                      resetForm({values : ''})
                                      setPrefecture("Conakry");
                                      setCategory("Vehicles");
                                      setSub_category("Cars");
                                      setImage(null);
                                  }
                                  setLoading(false);
                              }).catch((err) => {
                                  setLoading(false);
                                  console.log("catch... in onSubmit", err);
                              });
                          }
                      }}
                      validationSchema={validationSchema}
                  >
                      {/*<FormImagePicker*/}
                      {/*    name="Images"*/}
                      {/*/>*/}
                      <TouchableOpacity style={styles.imageContainer} onPress={handleImage} >
                          {!image && <MaterialCommunityIcons color={colors.medium} name="camera" size={40}/>}
                          {image && image.map((item) => <Image source={{ uri: item }} style={styles.image} />)}
                      </TouchableOpacity>
                      {/*<TouchableOpacity style={styles.imageContainer} onPress={pickImage} >*/}
                      {/*    {!image && <MaterialCommunityIcons color={colors.medium} name="camera" size={40} />}*/}
                      {/*    {image && <Image source={{ uri: image }} style={styles.image} />}*/}
                      {/*</TouchableOpacity>*/}
                      <FormField
                          maxLength={255}
                          name="title"
                          placeholder={t("listing_add:title")}
                      />
                      <FormField
                          keyboardType="numeric"
                          // maxLength={8}
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
                          maxLength={9}
                          name="phone"
                          placeholder={t("listing_add:contact")}
                      />
                      {/*<FormPicker*/}
                      {/*    items={categories}*/}
                      {/*    //numberOfColumns={1}*/}
                      {/*    name="category"*/}
                      {/*    PickerItemComponent={CategoryPickerItem}*/}
                      {/*    placeholder={t("listing_add:category")}*/}
                      {/*/>*/}
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
                      <Text style={styles.text}>{t("listing_add:select_category")}</Text>
                      <View style={styles.pickerContainer}>
                          <Picker
                              name={categories}
                              selectedValue={category}
                              style={styles.picker}
                              mode={"modal"}
                              onValueChange={(itemValue) => {
                                  const array = ["Vehicles", "Immovable", "Electronic", "Construction", "Education", "Furniture", "Food", "Job", "Health", "Services"];
                                  if(array.includes(itemValue) === false) {
                                      setSub_category("")
                                  }
                                  setCategory(itemValue)
                              }}
                          >
                              {categories.map( (s,i) => {
                                  return <Picker.Item value={s.category} label={t("category:" + i)} key={i}/>
                              })}
                          </Picker>
                      </View>
                      {category ?
                          <>
                              {categories.map((item, index) => {
                                  if(category === item.category && item.sub_category !== undefined) {
                                      return (
                                          <>
                                              <Text style={styles.text}>{t("listing_add:select_sub")}</Text>
                                              <View style={styles.pickerContainer}>
                                                  <Picker
                                                      name={item.sub_category}
                                                      selectedValue={sub_category}
                                                      style={styles.picker}
                                                      mode={"modal"}
                                                      onValueChange={(itemValue) => setSub_category(itemValue)}
                                                  >
                                                      {item.sub_category.map((itemInner, indexInner) => {
                                                          return <Picker.Item value={itemInner} label={t("category:"+index+"-"+indexInner)} key={indexInner.toString()}/>
                                                      })}
                                                  </Picker>
                                              </View>
                                          </>
                                      );
                                  }
                              })}
                          </> : <></>
                      }
                      <Text style={styles.text}>{t("listing_add:select_prefecture")}</Text>
                      <View style={styles.pickerContainer}>
                          <Picker
                              name={prefectures}
                              selectedValue={prefecture}
                              style={styles.picker}
                              mode={"modal"}
                              onValueChange={(itemValue) => setPrefecture(itemValue)}
                          >
                              {prefectures.map( (s,i) => {
                                  return <Picker.Item value={s} label={s} key={i}/>
                              })}
                          </Picker>
                      </View>
                      {loading ?
                          <>
                              <ActivityIndicator
                                  style={{marginTop: 10}}
                                  size={"large"}
                                  color={colors.primary}
                              />
                          </>
                          :
                          <SubmitButton title={t("listing_add:btn")}/>
                      }
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
        // width:"100%",
        flexDirection: "row"
    },
    image:{
        height:100,
        width:100,
        borderRadius:15,
        marginHorizontal: 2
    }
});

export default translate(["listing_add", "category"], {wait: true})(ListingEditScreen);
