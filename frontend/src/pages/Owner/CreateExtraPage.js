import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ExtraForm from './components/ExtraForm';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';

const CreateExtraPage = ({ match }) => {

    const restaurantId = match.params.id;
    const history = useHistory();

    const onSubmitCb = async event => {
        event.preventDefault();
        let formData = getFormDataJsonFromEvent(event);
        formData.price = parseFloat(formData.price);
        formData.restaurantId = restaurantId;

        const action = async () => axios.post('/owner/extra/', formData,
            { validateStatus: false });

        await requestHandler(action);
        alert('Extra created');
        history.goBack();
    };

    return <>
        <h3>Create Extra</h3>

        <ExtraForm onSubmitCb={onSubmitCb}>
            <button type="submit" className="btn btn-success btn-block">
                Create
            </button>
        </ExtraForm>
    </>
};

export default CreateExtraPage;