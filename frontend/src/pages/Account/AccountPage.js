import React from 'react';
import { Link } from 'react-router-dom';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const AccountPage = (props) => {
    return <>
        <p>
            <Link to='/account/edit/profile'>
                Edit profile
            </Link>
        </p>

        {
            props.identity.provider === 'CREDENTIALS' &&
            <p>
                <Link to='/account/edit/password'>
                    Change Password
                </Link>
            </p>
        }

        <p>
            <Link to='/account/addresses'>
                Shipping addresses
            </Link>
        </p>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(AccountPage);