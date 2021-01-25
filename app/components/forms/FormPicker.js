import React,{useEffect} from "react";
import { useFormikContext } from "formik";

import AppPicker from "../Picker";
import ErrorMessage from "./ErrorMessage";

const AppFormPicker = (props) => {
    const { items, name, numberOfColumns, PickerItemComponent, placeholder } = props;
    const { errors, setFieldValue, touched, values } = useFormikContext();
    useEffect(() => {
        //console.log("props", props);
    })
    return (
    <>
      <AppPicker
        items={items}
        numberOfColumns={numberOfColumns}
        onSelectItem={(item) => setFieldValue(name, item)}
        PickerItemComponent={PickerItemComponent}
        placeholder={placeholder}
        selectedItem={values[name]}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
}

export default AppFormPicker;
