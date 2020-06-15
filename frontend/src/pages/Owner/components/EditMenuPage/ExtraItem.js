import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExtraForm from '../ExtraForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../../common/utils';

const ExtraItem = ({ extra }) => {

    const history = useHistory();
    
    const [inEditMode, setInEditMode] = useState(false);
    const [extraState, setExtraState] = useState(Object.assign({}, extra));

    const onSubmitCb = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);

        const uri = `/owner/extra/${extraState._id}`;
        const action = async () => axios.put(uri, formData, { validateStatus: false });
        await requestHandler(action);

        setExtraState(extraState => Object.assign(formData, { _id: extraState._id }));
        setInEditMode(false);
    };

    const onDelete = async () => {
        if (window.confirm("Are you sure to remove pernamently this extra ingredient?")) {
            const action = async () => axios.delete(`/owner/extra/${extraState._id}`,
                { validateStatus: false });
            await requestHandler(action, {
                status: 200,
                callback: async () => history.go()
            });
        }
    };

    if (!inEditMode) return <>
        <p>
            <b>Name: </b> {extraState.name}
        </p>

        <p>
            <b>Price: </b> {extraState.price.toFixed(2)} PLN
        </p>

        <button className="btn btn-primary mr-2" onClick={() => setInEditMode(true)}>
            Edit
        </button>

        <button className="btn btn-danger" onClick={onDelete}>
            Delete
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