import React from 'react';
import { Link } from 'react-router-dom';

const GeneralInfoPage = () => {
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
            <Link to='/account/edit/address'>
                Edit address
            </Link>
        </p>
    </>
};

export default GeneralInfoPage;