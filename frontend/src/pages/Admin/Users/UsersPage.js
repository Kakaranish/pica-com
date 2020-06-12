import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../../common/utils';

const ManageUsersPage = () => {

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
        <h3>Users</h3>

        {
            state.users.map((user, i) =>
                <div key={`u-${i}`} className='p-2 mb-3' style={{ border: '1px solid red' }}>
                    <p>
                        <b>Id: </b>
                        <Link to={`/admin/manage/users/${user._id}`}>
                            {user._id}
                        </Link>
                    </p>
                    <p>
                        <b>Provider: </b>{user.provider}
                    </p>
                    <p>
                        <b>Provider key: </b>{user.providerKey}
                    </p>
                    <p>
                        <b>Name: </b>{user.firstName} {user.lastName}
                    </p>
                </div>)
        }
    </>
};

export default ManageUsersPage;