import React from 'react';
import { useFormikContext } from 'formik';

import TextInput from '../TextInput';
import ErrorMessage from './ErrorMessage';


function AppFormFied({name, ...otherProps}) {
    const {setFieldTouched, handleChange, errors, touched } = useFormikContext();
    return (
        <>
            <TextInput 
               
                onBlur ={() => setFieldTouched(name) }
                onChangeText={handleChange(name)}
                {...otherProps }
                
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />    
        </>
    );
}

export default AppFormFied;