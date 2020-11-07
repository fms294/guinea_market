import React from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import {
  AppForm as Form,
  AppFormField as FormField,
  AppFormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import Screen from "../components/Screen";
import CategoryPickerItem from "../components/CategoryPickerItem";
import FormImagePicker from "../components/FormImagePicker";
import ListingsApi from '../api/listings';
import useLocation from "../hooks/useLocation";



const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().required().min(1,"Please select at list one image")
});

const categories = [
  { label: "Furniture", value: 1, backgroundColor:"red" , icon: "apps"},
  { label: "Clothing", value: 2 , backgroundColor:"green", icon: "email"},
  { label: "Camera", value: 3 , backgroundColor:"blue", icon: "lock"},
];

function ListingEditScreen() {
  const location = useLocation();

  const handleSubmit = async() => {
    
    const result = await listingsApi.addListing(
      { ...listing, location},
      progress => console.log(progress));

    if(!result.ok) 
      return alert('Could not save the listing.');
    alert("Success");
  }
  
  return (
    <Screen style={styles.container}>
      <Form
        initialValues={{
          title: "",
          price: "",
          description: "",
          category: null,
          region:null,
          images:[]
        }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        <FormImagePicker name="images" />
        <FormField maxLength={255} name="title" placeholder="Title" />
        <FormField
          keyboardType="numeric"
          maxLength={8}
          name="price"
          placeholder="Price"
        />
        <Picker 
          items={categories} 
          numberOfColumns={3}
          name="category"
          PickerItemComponent={CategoryPickerItem} 
          placeholder="Category" 
        />
        <FormField
          maxLength={255}
          multiline
          name="description"
          numberOfLines={3}
          placeholder="Description"
        />
        <SubmitButton title="Post" />
      </Form>
    </Screen>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});
export default ListingEditScreen;
