import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import AwareComponentBuilder from '../common/AwareComponentBuilder';

const MainPage = (props) => {

    const history = useHistory();

    const verifyOnClick = async () => {
        const result = await axios.post('/auth/verify');
        if (result.data.identity) alert('Logged in');
        else alert('Not logged in');
    };

    const logOutOnClick = async () => {
        await axios.post('/auth/logout');
        props.unsetIdentity();
        props.clearNotifs();
        history.go();
    };

    const generateNotifOnClick = async () => {
        await axios.post('/notify', { content: 'NOTIF' }, { validateStatus: false });
    };

    return <>
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

        <button className="btn btn-primary" onClick={verifyOnClick}>
            Verify
        </button>

        <button className="btn btn-primary" onClick={logOutOnClick}>
            Log Out
        </button>

        <p>
            <Link to={'/upload-image'} >
                Upload Image
            </Link>
        </p>

        <p>
            <Link to={'/authorized'} >
                For authorized only
            </Link>
        </p>

        <p>
            <button className="btn btn-primary" onClick={generateNotifOnClick}>
                Generate notif
            </button>
        </p>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(MainPage);