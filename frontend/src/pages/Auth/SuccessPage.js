import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';
import { requestHandler } from '../../common/utils';

const SuccessPage = (props) => {

    const queryParams = queryString.parse(props.location.search);

    const [state, setState] = useState({ loading: true });

    useEffect(() => {
        const fetch = async () => {
            
            const action = async () => axios.get('/notifications');
            const result = await requestHandler(action);

            props.setNotifs(result);
            props.setIdentity({
                email: queryParams.email,
                firstName: queryParams.firstName,
                lastName: queryParams.lastName,
                role: queryParams.role,
            });
            setState({loading: false});
        };

        fetch();
    }, []);

    if (state.loading) return <></>
    return <Redirect to={'/'} />
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .withNotifsAwareness()
    .build(SuccessPage);