import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFormDataJsonFromEvent } from '../../common/utils';
import { useHistory } from 'react-router-dom';

const EditProfilePage = () => {

    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const result = await axios.get(`/account/profile`, { validateStatus: false });
            if (result.status !== 200) {
                alert('Error occured');
                console.log(result);
                setState({ loading: false });
                return;
            }
            setState({ loading: false, user: result.data });
        };

        fetch();
    }, []);

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const result = await axios.put('/account/profile', formData, { validateStatus: false });
        if (result.status !== 200) {
            alert('Error occured');
            console.log(result);
            setState({ loading: false });
            return;
        }

        history.go();
    }

    if (state.loading) return <></>;
    return <>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input name="email" type="text" className="form-control"
                    defaultValue={state.user.email} required />
            </div>

            <div className="form-group">
                <label>First name</label>
                <input name="firstName" type="text" className="form-control" placeholder="First name..."
                    defaultValue={state.user.firstName} required />
            </div>

            <div className="form-group">
                <label>Last name</label>
                <input name="lastName" type="text" className="form-control" placeholder="Last name..."
                    defaultValue={state.user.lastName} required />
            </div>

            <button type="submit" className="btn btn-success w-25">
                Update Profile
            </button>
        </form>
    </>
};

export default EditProfilePage;