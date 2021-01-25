import React, {useState} from 'react';
import {useFormikContext } from 'formik';

import AppButton from '../Button';

const SubmitButton = (props) => {
    const {handleSubmit} = useFormikContext();
    return (
        <AppButton title={props.title} onPress={handleSubmit} />
    );
}

export default SubmitButton;
