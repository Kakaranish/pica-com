import React from 'react';
import ExtraForm from './components/ExtraForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const CreateExtraIngredientPage = ({ match }) => {

    const restaurantId = match.params.id;
    const history = useHistory();

    const onSubmitCb = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);
        formData.restaurantId = restaurantId;

        const action = async () => axios.post('/extra-ingredient/', formData,
            { validateStatus: false });

        await requestHandler(action);
        alert('Extra ingredient created');
            history.goBack();
    };

    return <>
        <h3>Create Pizza Extra Ingredient</h3>

        <ExtraForm onSubmitCb={onSubmitCb}>
            <button type="submit" className="btn btn-success btn-block">
                Create
            </button>
        </ExtraForm>
    </>
};

export default CreateExtraIngredientPage;