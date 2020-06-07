import React from 'react';
import AddressForm from './components/AddressForm';
import { getFormDataJsonFromEvent } from '../../common/utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CreateAddressPage = () => {

    const history = useHistory();

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.isDefault = formData.isDefault === 'on' ? true : false;
        formData.flatCode = formData.flatCode === '' ? null : formData.flatCode;

        const result = await axios.post('/account/address', formData,
            { validateStatus: false });
        if (result.status !== 200) {
            alert('Error occured');
            console.log(result);
            return;
        }

        history.goBack();
    };

    return <>
        <h3>Create Address</h3>

        <AddressForm onSubmitCb={onSubmit} />
    </>
};

export default CreateAddressPage;