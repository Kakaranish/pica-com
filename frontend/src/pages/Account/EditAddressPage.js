import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFormDataJsonFromEvent, requestHandler, } from '../../common/utils';
import AddressForm from './components/AddressForm';
import { useHistory } from 'react-router-dom';

const EditAddressPage = (props) => {

    const addressId = props.match.params.id
    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get(`/account/address/${addressId}`,
                { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, address: result });
        };

        fetch();
    }, []);

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.isDefault = formData.isDefault === 'on' ? true : false;
        formData.flatCode = formData.flatCode === '' ? null : formData.flatCode;

        const action = async () => axios.put(`/account/address/${addressId}`,
            formData, { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => {
                alert('Address updated');
                history.goBack();
            }
        });
    };

    if (state.loading) return <></>;
    return <>
        <h3>Edit delivery address</h3>

        <AddressForm onSubmitCb={onSubmit} address={state.address} />
    </>
};

export default EditAddressPage;