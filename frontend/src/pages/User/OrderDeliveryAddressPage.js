import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestHandler, getFormDataJsonFromEvent } from '../../common/utils';
import { Redirect, useHistory } from 'react-router-dom';
import DeliveryAddressForm from './OrderPage/DeliveryAddressForm';

const OrderDeliveryAddressPage = ({ match }) => {

    const orderId = match.params.id;
    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const uri = `/orders/${orderId}`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const order = await requestHandler(action);
            setState({
                loading: false,
                isAccessible: order && !order.deliveryAddress
            });
        };
        fetch();
    }, []);

    const onSubmit = async event => {
        event.preventDefault();

        const confirmText = `Are you sure this address is correct? ` +
            `You won't be able to edit it later.\n` +
            `Click OK to move to go to next step`;
        if (window.confirm(confirmText)) {
            let formData = getFormDataJsonFromEvent(event);
            if (formData.flatCode === "") delete formData.flatCode;

            const uri = `/orders/${orderId}/delivery-address`;
            const action = async () => axios.put(uri, formData,
                { validateStatus: false });
            await requestHandler(action, {
                status: 200,
                callback: async () => {
                    const nextStepUri = `/user/orders/${orderId}/step/payment`;
                    history.push(nextStepUri);
                }
            }, {
                status: 400,
                callback: async res => console.log(res)
            });
        }
    };

    if (state.loading) return <></>;
    else if (!state.isAccessible) return <Redirect to='/error/404' />

    return <>
        <h3>Where to deliver food?</h3>
        <DeliveryAddressForm onSubmit={onSubmit}>
            <button className="btn btn-primary">
                Continue Placing an Order
            </button>
        </DeliveryAddressForm>
    </>
};

export default OrderDeliveryAddressPage;