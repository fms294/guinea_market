import React, { useState } from "react";
import { View, StyleSheet, Picker, Text , Dimensions} from "react-native";
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
import { useLocation } from "../hooks/useLocation";
import UploadScreen from "./UploadScreen";
import {categories, regions} from "../data/data";
import * as listingAction from "../store/actions/listing";
import { useDispatch } from "react-redux";

const phoneRegEx = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(1).label("Title"),
    price: Yup.number().required().min(1).max(10000).label("Price"),
    description: Yup.string().required().label("Description"),
    category: Yup.object().required().nullable().label("Category"),
    phone: Yup.string().required().matches(phoneRegEx, 'Phone number is not valid').label("Phone"),
    //images: Yup.array().min(1,"Please select at list one image").label("Images")
});

const ListingEditScreen = (props) => {
    const dispatch = useDispatch();

    const location = useLocation();
    //console.log("location", location);
    const [uploadVisible, setUploadVisible] = useState(false);
    const [progress, setProgress] = useState(0);
    const [region, setRegion] = useState();
    //categories.map((item) => console.log(item));

    const handleSubmission = async (values) => {
        const finalData = {
          "title": values.title,
          "images": [{ "url": "https://image.shutterstock.com/image-vector/red-color-fleece-outdoor-jacket-260nw-49520670" }],
          "price": values.price,
          "description": values.description,
          "category": values.category.label,
          "region": region,
          "phone": values.phone,
          "location": [location.latitude, location.longitude]
        }
        console.log("FinalData", finalData);
        await dispatch(listingAction.add_item(finalData));
    }

  //let serviceItems =

  return (
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
        onSubmit={(values) => handleSubmission(values)}
        validationSchema={validationSchema}
      >
        <FormImagePicker
            name="Images"
        />
        <FormField
            maxLength={255}
            name="title"
            placeholder="Title"
        />
        <FormField
            keyboardType="numeric"
            maxLength={8}
            name="price"
            placeholder="Price"
        />
        <FormField
            maxLength={255}
            multiline
            name="description"
            numberOfLines={3}
            placeholder="Description"
        />
        <FormPicker
            items={categories}
            //numberOfColumns={1}
            name="category"
            PickerItemComponent={CategoryPickerItem}
            placeholder="Category"
        />
        <FormField
            maxLength={10}
            name="phone"
            placeholder="Contact Number"
        />
          <Text style={styles.text}>Select Region</Text>
          <View style={styles.pickerContainer}>
              <Picker
                  name={region}
                  selectedValue={region}
                  style={styles.picker}
                  onValueChange={(itemValue) => setRegion(itemValue)}
              >
                  {regions.map( (s,i) => {
                      return <Picker.Item value={s} label={s} key={i}/>
                  })}
              </Picker>
          </View>
        <SubmitButton title="Post"/>
      </Form>
    </Screen>
  );
}


const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    pickerContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        margin: 10,
    },
    text: {
        marginHorizontal: 20,
        marginVertical: 10,
        fontSize: 20,
    },
    picker: {
        width: '100%',
    },
});
export default ListingEditScreen;
