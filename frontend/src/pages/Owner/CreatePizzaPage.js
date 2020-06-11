import React from 'react';
import PizzaForm from './components/PizzaForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const CreatePizzaPage = ({ match }) => {

    const restaurantId = match.params.id;
    const history = useHistory();

    const onSubmitCb = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.restaurantId = restaurantId;
        formData.price = parseFloat(formData.price);
        formData.diameter = parseInt(formData.diameter);

        const action = async () => axios.post('/pizza', formData,
            { validateStatus: false });
        await requestHandler(action);
        history.goBack();
    }

    return <>
        <h3>Create Pizza</h3>
        <PizzaForm onSubmitCb={onSubmitCb}>
            <button type="submit" className="btn btn-success btn-block">
                Create
            </button>
        </PizzaForm>
    </>
};

export default CreatePizzaPage;