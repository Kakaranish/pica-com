import React, { useState } from 'react';
import PizzaForm from '../PizzaForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../../../common/utils';
import axios from 'axios';

const PizzaItem = ({ pizza }) => {

    const [inEditMode, setInEditMode] = useState(false);
    const [pizzaState, setPizzaState] = useState(Object.assign({}, pizza));

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);
        formData.diameter = parseInt(formData.diameter);
        formData.pizzaId = pizzaState._id;

        const action = async () => axios.put(`/pizza/${pizzaState._id}`, formData,
            { validateStatus: false });
        await requestHandler(action);

        setPizzaState(pizzaState => Object.assign(formData, { _id: pizzaState._id }));
        setInEditMode(false);
    }

    if (!inEditMode) return <>
        <p>
            <b>Name: </b> {pizzaState.name}
        </p>

        <p>
            <b>Description: </b> {pizzaState.description}
        </p>

        <p>
            <b>Diameter: </b> {pizzaState.diameter}
        </p>

        <p>
            <b>Price: </b> {pizzaState.price}
        </p>

        <button className="btn btn-primary" onClick={() => setInEditMode(true)}>
            Edit
        </button>
    </>

    return <>
        <PizzaForm pizza={pizzaState} onSubmitCb={onSubmit}>
            <button type="submit" className="btn btn-primary">
                Update
            </button>

            <button className="btn btn-danger" onClick={() => setInEditMode(false)}>
                Cancel
            </button>
        </PizzaForm>
    </>
};

export default PizzaItem;