import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { getFormDataJsonFromEvent, requestHandler } from '../../../common/utils';

const EditUserPage = (props) => {

    const history = useHistory();
    const userId = props.match.params.id;

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get(`/admin/users/${userId}`,
                { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, user: result });
        };

        fetch();
    }, []);

    const onSubmit = async event => {
        event.preventDefault();
        const formData = getFormDataJsonFromEvent(event);

        const action = async () => axios.put(`/admin/users/${userId}`, formData,
            { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => history.go()
        });
    }

    if (state.loading) return <></>;
    else if (!state.user) return <h3>No such user</h3>;
    return <>

        <h3>User {state.user._id}</h3>

        <p>
            Created at {moment(state.user.createdAt).format('YYYY-MM-DD')}
        </p>

        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>Provider</label>
                <input name="provider" type="text" className="form-control" placeholder="Provider..."
                    value={state.user.provider} readOnly />
            </div>

            <div className="form-group">
                <label>Provider Key</label>
                <input name="providerKey" type="text" className="form-control" placeholder="Provider Key..."
                    value={state.user.providerKey} readOnly />
            </div>

            <div className="form-group">
                <label>Email</label>
                <input name="email" type="text" className="form-control"
                    value={state.user.email} required />
            </div>

            <div className="form-group">
                <div className="dropdown">
                    <label>Role</label><br></br>
                    <select name="role" className="custom-select" required>
                        {
                            ["USER", "ADMIN", "OWNER"].map((role) =>
                                <option selected={state.user.role === role} key={`opt-${role}`} value={role}>
                                    {role}
                                </option>
                            )
                        }
                    </select>
                </div>
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
                Update User
            </button>
        </form>
    </>
};

export default EditUserPage;