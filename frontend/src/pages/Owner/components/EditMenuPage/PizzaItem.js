import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import PizzaForm from '../PizzaForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../../common/utils';
import { toast } from 'react-toastify';

const PizzaItem = ({ pizza }) => {

    const history = useHistory();

    const [inEditMode, setInEditMode] = useState(false);
    const [pizzaState, setPizzaState] = useState(Object.assign({}, pizza));

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);
        formData.diameter = parseInt(formData.diameter);

        const action = async () => axios.put(`/owner/pizza/${pizzaState._id}`, formData,
            { validateStatus: false });
        await requestHandler(action);

        setPizzaState(pizzaState => Object.assign(formData, { _id: pizzaState._id }));
        setInEditMode(false);

        toast('Pizza updated');
    }

    const onDelete = async () => {
        if (window.confirm("Do you really want to delete this pizza?")) {
            const action = async () => axios.delete(`/owner/pizza/${pizzaState._id}`,
                { validateStatus: false });
            await requestHandler(action, {
                status: 200,
                callback: async () => {
                    toast('Pizza deleted');
                    history.push('/refresh');
                }
            });
        }
    };

    if (!inEditMode) return <>
        <b>Name: </b> {pizzaState.name}
        <br />

        <b>Description: </b> {pizzaState.description}
        <br />

        <b>Diameter: </b> {pizzaState.diameter} cm
        <br />

        <b>Price: </b> {pizzaState.price.toFixed(2)} PLN
        <br />

        <div className="mt-3">
            <button className="btn btn-primary mr-2" onClick={() => setInEditMode(true)}>
                Edit
            </button>

            <button className="btn btn-danger" onClick={onDelete}>
                Delete
            </button>
        </div>
    </>

    return <>
        <PizzaForm pizza={pizzaState} onSubmitCb={onSubmit}>
            <button type="submit" className="btn btn-primary mr-2">
                Update
            </button>

            <button className="btn btn-danger" onClick={() => setInEditMode(false)}>
                Cancel
            </button>
        </PizzaForm>
    </>
};

export default PizzaItem;