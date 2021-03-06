import React from 'react';
import { Link } from 'react-router-dom';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const AccountPage = (props) => {
    return <>

        <h3 className="mb-3">Manage your account</h3>

        <p>
            <Link to='/account/edit/profile'>
                Edit contact info
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
                Delivery addresses
            </Link>
        </p>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(AccountPage);