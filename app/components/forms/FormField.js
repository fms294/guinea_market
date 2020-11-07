import React from 'react';
import { useFormikContext } from 'formik';

import TextInput from '../TextInput';
import ErrorMessage from './ErrorMessage';


function AppFormFied({name, ...otherProps}) {
    const {setFieldTouched, sestFieldValue, errors, touched , values} = useFormikContext();
    return (
        <>
            <TextInput 
                onBlur ={() => setFieldTouched(name) }
                onChangeText={text => sestFieldValue(name, text)}
                value={values[name]}
                {...otherProps }
                
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />    
        </>
    );
}

export default AppFormFied;