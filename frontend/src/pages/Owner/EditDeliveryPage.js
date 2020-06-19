import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'
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
        formData.avgDeliveryTime = parseInt(formData.avgDeliveryTime);
        formData.avgPreparationTime = parseInt(formData.avgPreparationTime);
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

            <div className="form-group">
                <label>
                    Average Order Preparation Time (minutes)&nbsp;
                </label>

                <FontAwesomeIcon icon={faQuestionCircle}
                    style={{ color: 'lightgray' }}
                    size={'1x'}
                    data-tip="Time from receiving order to preparing it to the delivery" />

                <input name="avgPreparationTime"
                    defaultValue={state.deliveryInfo.avgPreparationTime}
                    type="number"
                    className="form-control"
                    min={1}
                    step={1}
                    placeholder="Average Preparation Time..."
                    required />
            </div>

            <div className="form-group">
                <label>
                    Average Delivery Time (minutes)&nbsp;
                </label>

                <FontAwesomeIcon icon={faQuestionCircle}
                    style={{ color: 'lightgray' }}
                    size={'1x'}
                    data-tip="Time from order preparation to delivery to the customer" />

                <input name="avgDeliveryTime"
                    defaultValue={state.deliveryInfo.avgDeliveryTime}
                    type="number"
                    className="form-control"
                    min={1}
                    step={1}
                    placeholder="Average Delivery Time..."
                    required />
            </div>

            <button type="submit" className="btn btn-primary btn-block">
                Submit
            </button>

            <ReactTooltip />
        </form>
    </>
};

export default EditDeliveryPage;