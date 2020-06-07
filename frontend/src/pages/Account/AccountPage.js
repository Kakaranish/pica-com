import React from 'react';
import { Link } from 'react-router-dom';

const AccountPage = () => {
    return <>
        <p>
            <Link to='/account/edit/profile'>
                Edit profile
            </Link>
        </p>

        <p>
            <Link to='/account/edit/password'>
                Change Password
            </Link>
        </p>

        <p>
            <Link to='/account/addresses'>
                Shipping addresses
            </Link>
        </p>
    </>
};

export default AccountPage;