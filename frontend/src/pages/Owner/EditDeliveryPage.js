import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MinFreeDeliveryInput from './components/EditDeliveryPage/MinFreeDeliveryInput';
import { requestHandler, getFormDataJsonFromEvent } from '../../common/utils';

const EditDeliveryPage = ({ match }) => {

    const restaurantId = match.params.id;

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const uri = `/owner/restaurants/${restaurantId}/delivery-info`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const result = await requestHandler(action);

            let deliveryInfo = Object.assign(result,
                { hasMinFreeDeliveryPrice: !!result.minFreeDeliveryPrice });
            setState({ loading: false, deliveryInfo });
        };
        fetch();
    }, []);

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.deliveryPrice = parseFloat(formData.deliveryPrice);
        if (formData.minFreeDeliveryPrice)
            formData.minFreeDeliveryPrice = parseFloat(formData.minFreeDeliveryPrice);

        const uri = `/owner/restaurants/${restaurantId}/delivery-info`;
        const action = async () => axios.put(uri, formData, { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => alert('OK - updated')
        });
    };

    if (state.loading) return <></>
    return <>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <MinFreeDeliveryInput defaultValue={state.deliveryInfo.minFreeDeliveryPrice} />
            </div>

            <div className="form-group">
                <label>Delivery Price</label>
                <input name="deliveryPrice"
                    defaultValue={state.deliveryInfo.deliveryPrice}
                    type="number"
                    className="form-control"
                    min={0}
                    step={0.01}
                    placeholder="Delivery price..."
                    required />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
                Submit
            </button>
        </form>
    </>
};

export default EditDeliveryPage;