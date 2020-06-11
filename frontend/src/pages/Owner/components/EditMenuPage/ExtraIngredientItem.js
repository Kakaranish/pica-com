import React, { useState } from 'react';
import ExtraForm from '../ExtraForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../../common/utils';
import axios from 'axios';

const ExtraIngredientItem = ({ extraIngredient }) => {

    const [inEditMode, setInEditMode] = useState(false);
    const [extraIngredientState, setExtraIngredientState] = useState(
        Object.assign({}, extraIngredient));

    const onSubmitCb = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);

        const uri = `/extra-ingredient/${extraIngredientState._id}`;
        const action = async () => axios.put(uri, formData, { validateStatus: false });
        await requestHandler(action);

        setExtraIngredientState(extraIngState => Object.assign(formData, { _id: extraIngState._id }));
        setInEditMode(false);
    };

    if (!inEditMode) return <>
        <p>
            <b>Name: </b> {extraIngredientState.name}
        </p>

        <p>
            <b>Price: </b> {extraIngredientState.price.toFixed(2)} PLN
        </p>

        <button className="btn btn-primary" onClick={() => setInEditMode(true)}>
            Edit
        </button>
    </>

    return <>
        <ExtraForm extra={extraIngredient} onSubmitCb={onSubmitCb}>
            <button type="submit" className="btn btn-primary">
                Update
            </button>

            <button className="btn btn-danger" onClick={() => setInEditMode(false)}>
                Cancel
            </button>
        </ExtraForm>
    </>
};

export default ExtraIngredientItem;