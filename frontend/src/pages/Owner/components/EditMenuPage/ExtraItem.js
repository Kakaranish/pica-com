import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExtraForm from '../ExtraForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../../common/utils';
import { toast } from 'react-toastify';

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
        toast('Extra updated');
    };

    const onDelete = async () => {
        if (window.confirm("Do you really want to delete this extra?")) {
            const action = async () => axios.delete(`/owner/extra/${extraState._id}`,
                { validateStatus: false });
            await requestHandler(action, {
                status: 200,
                callback: async () => {
                    toast('Extra deleted')
                    history.push('/refresh');
                }
            });
        }
    };

    if (!inEditMode) return <>
        <b>Name: </b> {extraState.name}
        <br />

        <b>Price: </b> {extraState.price.toFixed(2)} PLN
        <br />

        <div className="mt-2">
            <button className="btn btn-primary mr-2" onClick={() => setInEditMode(true)}>
                Edit
            </button>

            <button className="btn btn-danger" onClick={onDelete}>
                Delete
            </button>
        </div>
    </>

    return <>
        <ExtraForm extra={extra} onSubmitCb={onSubmitCb}>
            <button type="submit" className="btn btn-primary mr-2">
                Update
            </button>

            <button className="btn btn-danger" onClick={() => setInEditMode(false)}>
                Cancel
            </button>
        </ExtraForm>
    </>
};

export default ExtraItem;