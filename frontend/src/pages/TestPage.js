import React from 'react';
import axios from 'axios';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import { requestHandler } from '../common/utils';

const TestPage = () => {
    const verifyOnClick = async () => {
        const result = await requestHandler(async () => axios.post('/auth/verify'));
        if (result.identity) alert('Logged in');
        else alert('Not logged in');
    };

    const generateNotifOnClick = async () => {
        await requestHandler(async () =>
            axios.post('/notify', { content: 'NOTIF' }, { validateStatus: false }));
    };

    return <>

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
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(TestPage);