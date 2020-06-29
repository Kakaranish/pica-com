import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestHandler, getFormDataJsonFromEvent } from '../../common/utils';
import RestaurantBasicInfoForm from './components/RestaurantBasicInfoForm';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditRestaurantBasicInfoPage = ({ match }) => {

    const history = useHistory();

    const restaurantId = match.params.id;

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get(`/owner/restaurants/${restaurantId}`,
                { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, restaurant: result });
        };

        fetch();
    }, []);

    const onSubmit = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.categories = JSON.parse(formData.categories);

        const uri = `/owner/restaurants/${restaurantId}/basic`;
        const action = async () => axios.put(uri, formData, { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => {
                toast('Basic info updated');
                history.goBack();
            }
        });
    };

    if (state.loading) return <></>
    else return <>
        <h3 className="mb-3">Edit restaurant basic info</h3>

        <RestaurantBasicInfoForm restaurant={state.restaurant} onSubmit={onSubmit}>
            <button className="btn btn-success w-25">
                Update
            </button>
        </RestaurantBasicInfoForm>
    </>
};

export default EditRestaurantBasicInfoPage; 