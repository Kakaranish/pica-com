import React from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';

const CreateRestaurantPage = () => {

    const history = useHistory();

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const action = async () => axios.post('/owner/restaurants', formData,
            { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async result => history.push(`/owner/restaurants/${result}/edit`)
        });
    }

    return <>
        <h3>Provide basic restaurant info</h3>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Name</label>
                <input name="name" type="text" className="form-control"
                    placeholder="Name..." required />
            </div>

            <div className="form-group">
                <label>Description</label>
                <textarea name="description" type="text" className="form-control"
                    placeholder="Description..." rows="4" required>

                </textarea>
            </div>

            <div className="form-group">
                <label>City</label>
                <input name="city" type="text" className="form-control"
                    placeholder="City..." required />
            </div>

            <div className="form-group">
                <label>Postcode</label>
                <input name="postcode" type="text" className="form-control"
                    placeholder="Postcode..." required />
            </div>

            <div className="form-group">
                <label>Address</label>
                <input name="address" type="text" className="form-control"
                    placeholder="Address..." required />
            </div>

            <div className="form-group">
                <label>Contact number</label>
                <input name="contactNumber" type="text" className="form-control"
                    placeholder="Contact number..." required />
            </div>

            <button type="submit" className="btn btn-success btn-block">
                Create Draft
            </button>
        </form>
    </>
};

export default CreateRestaurantPage;