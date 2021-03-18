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
    AppFormPicker as FormPicker,
    SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
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
    //category: Yup.object().required().nullable().label("Category"),
    phone: Yup.string().required().matches(phoneRegEx, 'Phone number is not valid').label("Phone"),
    //images: Yup.array().min(1,"Please select at list one image").label("Images")
});

const ListingUpdateScreen = (props) => {
    const {t} = props;
    const dispatch = useDispatch();

    const props_initial = props.route.params.initial;
    const initial = {
        title: props_initial.title,
        price: props_initial.price.toString(),
        description: props_initial.description,
        phone: props_initial.contact_phone,
    }
    let images = [];
    props_initial.images.map((item, index) => {
        images.push(item);
    })
    // console.log("initial", props_initial);
    const [image, setImage] = useState(props_initial.images[0].url);
    const [imageData, setImageData] = useState(null);
    const [category, setCategory] = useState(props_initial.main_category);
    const [sub_category, setSub_category] = useState(props_initial.sub_category);
    const [prefecture, setPrefecture] = useState(props_initial.prefecture);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        props.navigation.setOptions({
            title: t("listing_add:update")
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
        let finalData;
        if(imageData === null) {
            finalData = {
                "title": values.title,
                "price": values.price,
                "description": values.description,
                "main_category": category,
                "sub_category" : sub_category,
                "prefecture": prefecture,
                "contact_phone": values.phone,
                "images" : images
            }
        } else {
            finalData = {
                "title": values.title,
                "price": values.price,
                "description": values.description,
                "main_category": category,
                "sub_category" : sub_category,
                "prefecture": prefecture,
                "contact_phone": values.phone,
                "images" : [{imageData}, {imageData}]
            }
        }
        console.log("FinalData", finalData);
        await dispatch(listingAction.update_item(finalData, props_initial.id));
    }

    return (
        <ScrollView>
            <Screen style={styles.container}>
                <Form
                    initialValues={initial}
                    onSubmit={(values) => {
                        if (values === initial && image === props_initial.images[0].url) {
                            Alert.alert(t("listing_add:alert_update_title"), t("listing_add:alert_update_msg"), [{text: t("listing_add:okay")}]);
                        } else {
                            setLoading(true);
                            handleSubmission(values).then(() => {
                                setLoading(false);
                                props.navigation.goBack();
                            }).catch((err) => {
                                setLoading(false);
                                console.log("catch...update screen", err);
                            });
                        }
                    }}
                    validationSchema={validationSchema}
                >
                    <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                        {image === props_initial.images[0].url ?
                            <Image source={{ uri: image }} style={styles.image} />
                            :
                            <Image source={{ uri: image }} style={[styles.image, { borderWidth: 3 ,borderColor: "red"}]} />
                        }
                    </TouchableOpacity>
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
                    <Text style={styles.text}>{t("listing_add:select_category")}</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            name={categories}
                            selectedValue={category}
                            style={styles.picker}
                            mode={"modal"}
                            onValueChange={(itemValue) => {
                                const array = ["Construction", "Education", "Electronics", "Furniture", "Grocery", "Housing", "Services"];
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
                        <SubmitButton title={t("listing_add:btn_update")}/>
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
        alignItems: 'center',
    },
    text: {
        marginLeft: 20,
        fontSize: 20,
        color: colors.medium
    },
    picker: {
        width: '70%',
    },
    imageContainer:{
        alignItems:'center',
        backgroundColor: colors.light,
        height:100,
        justifyContent:'center',
        overflow:'hidden',
        width:100
    },
    image:{
        height:100,
        width:100,
        borderRadius:15,
    }
});

export default translate(["listing_add"], {wait: true})(ListingUpdateScreen);
