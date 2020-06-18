import React from 'react';
import AddressForm from './components/AddressForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CreateAddressPage = () => {

    const history = useHistory();

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.flatCode = formData.flatCode === '' ? null : formData.flatCode;

        const action = async () => axios.post('/account/address', formData,
            { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => history.goBack()
        });
    };

    return <>
        <h3>Create Address</h3>

        <AddressForm onSubmitCb={onSubmit} />
    </>
};

export default CreateAddressPage;