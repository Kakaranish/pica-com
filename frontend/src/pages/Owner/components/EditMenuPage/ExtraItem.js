import React, { useState } from 'react';
import ExtraForm from '../ExtraForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../../common/utils';
import axios from 'axios';

const ExtraItem = ({ extra }) => {

    const [inEditMode, setInEditMode] = useState(false);
    const [extraState, setExtraState] = useState(Object.assign({}, extra));

    const onSubmitCb = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);

        const uri = `/extra/${extraState._id}`;
        const action = async () => axios.put(uri, formData, { validateStatus: false });
        await requestHandler(action);

        setExtraState(extraState => Object.assign(formData, { _id: extraState._id }));
        setInEditMode(false);
    };

    if (!inEditMode) return <>
        <p>
            <b>Name: </b> {extraState.name}
        </p>

        <p>
            <b>Price: </b> {extraState.price.toFixed(2)} PLN
        </p>

        <button className="btn btn-primary" onClick={() => setInEditMode(true)}>
            Edit
        </button>
    </>

    return <>
        <ExtraForm extra={extra} onSubmitCb={onSubmitCb}>
            <button type="submit" className="btn btn-primary">
                Update
            </button>

            <button className="btn btn-danger" onClick={() => setInEditMode(false)}>
                Cancel
            </button>
        </ExtraForm>
    </>
};

export default ExtraItem;