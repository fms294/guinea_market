import React from 'react';
import {useFormikContext} from 'formik';

import ErrorMessage from './forms/ErrorMessage';
import ImageInputList from './ImageInputList';

const FormImagePicker = (props) => {
    const { errors, setFieldValue, touched, values } = useFormikContext();
    const imageUris = values[props.name]
    console.log("props...", values);

    const handleAdd = (uri) => {
        console.log("add", uri);
        setFieldValue(props.name, [...imageUris, uri]);
    }

    const handleRemove = (uri) => {
        setFieldValue(props.name, imageUris.filter(imageUri => imageUri !== uri ));
    }

    return (
        <>
            <ImageInputList
                imageUris={imageUris}
                onAddImage={handleAdd}
                onRemoveImage={handleRemove}
            />
            <ErrorMessage error={errors[props.name]} visible={touched[props.name]} />
        </>
  );
}


export default FormImagePicker;
