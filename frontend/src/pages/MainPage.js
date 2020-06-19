import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import { requestHandler } from '../common/utils';

const MainPage = (props) => {

    const history = useHistory();

    // TODO: To remove in the future
    const verifyOnClick = async () => {
        const result = await requestHandler(async () => axios.post('/auth/verify'));
        if (result.identity) alert('Logged in');
        else alert('Not logged in');
    };

    const logOutOnClick = async () => {
        await requestHandler(async () => axios.post('/auth/logout'));
        props.unsetIdentity();
        props.clearNotifs();
        history.go();
    };

    const generateNotifOnClick = async () => {
        await requestHandler(async () =>
            axios.post('/notify', { content: 'NOTIF' }, { validateStatus: false }));
    };

    return <>

        {
            props.identity?.role === 'ADMIN' &&
            <>
                <div className="p-3 mb-2" style={{ border: '1px solid red' }}>
                    <p>Admin-only actions:</p>

                    <p>
                        <Link to={'/admin/manage'}>
                            Manage
                        </Link>
                    </p>
                </div>
            </>
        }

        {
            props.identity?.role === 'OWNER' &&
            <>
                <div className="p-3 mb-2" style={{ border: '1px solid red' }}>
                    <p>Owner-only actions:</p>

                    <p>
                        <Link to={'/owner/restaurants'}>
                            Manage Restaurants
                        </Link>
                    </p>
                    
                    <p>
                        <Link to={'/owner/orders'}>
                            Manage Orders
                        </Link>
                    </p>

                </div>
            </>
        }

        {
            props.identity &&
            <>
                <div className="p-3 mb-2" style={{ border: '1px solid red' }}>
                    <p>Authorized only actions:</p>

                    <p>
                        <Link to={'/account'}>
                            Manage Account
                        </Link>
                    </p>

                    <p>
                        <Link to={'/user/orders'}>
                            Manage Orders
                        </Link>
                    </p>

                </div>
            </>
        }

        {
            !props.identity
                ? <>
                    <p>
                        <Link to={'/auth/login'} >
                            Login
                        </Link>
                    </p>

                    <p>
                        <Link to={'/auth/register'} >
                            Register
                        </Link>
                    </p>
                </>

                : <>
                    <p>
                        <button className="btn btn-primary" onClick={logOutOnClick}>
                            Log Out
                        </button>
                    </p>
                </>
        }

        <p>
            <button className="btn btn-primary" onClick={verifyOnClick}>
                Verify
            </button>
        </p>

        <p>
            <button className="btn btn-primary" onClick={generateNotifOnClick}>
                Generate notif
            </button>
        </p>

        <p>
            <Link to={'/restaurants/5ee3653552f97011ca816218'} className="btn btn-primary">
                Test restaurant
            </Link>
        </p>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(MainPage);