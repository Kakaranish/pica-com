import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExtraForm from './components/ExtraForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import { toast } from 'react-toastify';

const CreateExtraIngredientPage = ({ match }) => {

    const restaurantId = match.params.id;
    const history = useHistory();

    const onSubmitCb = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);
        formData.restaurantId = restaurantId;

        const action = async () => axios.post('/owner/extra-ingredient/', formData,
            { validateStatus: false });

        await requestHandler(action, {
            status: 200,
            callback: async () => {
                toast('Extra ingredient created');
                history.goBack();
            }
        });
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