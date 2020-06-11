import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { requestHandler, getFormDataJsonFromEvent } from '../../common/utils';
import RestaurantBasicInfoForm from './components/RestaurantBasicInfoForm';
import { useHistory } from 'react-router-dom';

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
        const formData = getFormDataJsonFromEvent(event);

        const uri = `/owner/restaurants/${restaurantId}/basic`;
        const action = async () => axios.put(uri, formData, { validateStatus: false });
        const result = await requestHandler(action);
        if(result) {
            alert('Updated');
            history.go();
        }
    };

    if (state.loading) return <></>
    else return <>
        <RestaurantBasicInfoForm restaurant={state.restaurant} onSubmit={onSubmit}>
            <button className="btn btn-primary btn-block">
                Update
            </button>
        </RestaurantBasicInfoForm>
    </>
};

export default EditRestaurantBasicInfoPage; 