import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../../common/utils';
import '../../../assets/css/style.css';

const ManageUsersPage = () => {

    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get('/admin/users',
                { validateStatus: false });
            const result = await requestHandler(action);
            setState({ loading: false, users: result });
        };

        fetch();
    }, []);

    if (state.loading) return <></>;
    else if (!state.users) return <h3>No users found</h3>;

    return <>
        <h3 className="mb-3">Manage users</h3>

        {
            state.users.map((user, i) =>
                <div key={`u-${i}`} className='p-3 mb-3 preview-box border border-darken-1'
                    onClick={() => history.push(`/admin/manage/users/${user._id}`)}>
                    <b>Id: </b> {user._id}
                    <br />

                    <b>Role: </b>{user.role}
                    <br />

                    <b>Provider: </b>{user.provider}
                    <br />

                    <b>Provider key: </b>{user.providerKey}
                    <br />

                    <b>Name: </b>{user.firstName} {user.lastName}
                    <br />
                </div>
            )
        }
    </>
};

export default ManageUsersPage;