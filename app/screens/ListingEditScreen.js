import React, { useState } from "react";
import { View, StyleSheet, Picker, Text , ScrollView} from "react-native";
import * as Yup from "yup";

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
    const [progress, setProgress] = useState(0);
    const [region, setRegion] = useState("Conakry");
    //categories.map((item) => console.log(item));

    const handleSubmission = async (values) => {
       //console.log("values.....", values);
        const finalData = {
            "title": values.title,
            "images": [
                { "url": "https://usabilitygeek.com/wp-content/uploads/2016/08/usability-testing-prototype.jpg" },
                { "url" : "https://homepages.cae.wisc.edu/~ece533/images/monarch.png" }
            ],
            "price": values.price,
            "description": values.description,
            "main_category": values.category,
            "sub_category" : "",
            "region": region,
            "contact_phone": values.phone
        }
        console.log("FinalData", finalData);
        await dispatch(listingAction.add_item(finalData));
    }

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
                              resetForm({values : ''})
                              setRegion("Conakry");
                          })
                      }}
                      validationSchema={validationSchema}
                  >
                      <FormImagePicker
                          name="Images"
                      />
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
                      <FormPicker
                          items={categories}
                          //numberOfColumns={1}
                          name="category"
                          PickerItemComponent={CategoryPickerItem}
                          placeholder={t("listing_add:category")}
                      />
                      <FormField
                          keyboardType="numeric"
                          maxLength={10}
                          name="phone"
                          placeholder={t("listing_add:contact")}
                      />
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
});
export default translate(["listing_add"], {wait: true})(ListingEditScreen);
