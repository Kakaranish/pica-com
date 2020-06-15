import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFormDataJsonFromEvent, requestHandler } from '../../common/utils';
import { useHistory } from 'react-router-dom';

const EditProfilePage = () => {

    const history = useHistory();

    const [validationErrors, setValidationErrors] = useState(null);

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get(`/account/profile`,
                { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, user: result });
        };

        fetch();
    }, []);

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const action = async () => axios.put('/account/profile', formData,
            { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => history.go()
        }, {
            status: 400,
            callback: async result =>
                setValidationErrors(result.map(e => e.msg))
        });
    }

    if (state.loading) return <></>;
    return <>
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Contact email</label>
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

        {
            validationErrors &&
            <div className="col-12 mt-2">
                <p className="text-danger font-weight-bold" style={{ marginBottom: '0px' }}>
                    Validation errors
                    </p>
                <ul style={{ paddingTop: "0", marginTop: "0px" }}>
                    {
                        validationErrors.map((error, i) => {
                            return <li key={`val-err-${i}`} className="text-danger">
                                {error}
                            </li>
                        })
                    }
                </ul>
            </div>
        }
    </>
};

export default EditProfilePage;