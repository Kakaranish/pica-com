import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import { toast } from 'react-toastify';
import RestaurantBasicInfoForm from './components/RestaurantBasicInfoForm';

const CreateRestaurantPage = () => {

    const history = useHistory();

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.categories = JSON.parse(formData.categories);

        const action = async () => axios.post('/owner/restaurants', formData,
            { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async result => {
                toast('Restaurant created');
                history.push(`/owner/restaurants/${result.id}/edit`)
            }
        });
    };

    return <>
        <h3 className="mb-2">Provide basic restaurant info</h3>

        <RestaurantBasicInfoForm onSubmit={onSubmit}>
            <button className="btn btn-success w-25">
                Create
            </button>
        </RestaurantBasicInfoForm>
    </>
};

export default CreateRestaurantPage;