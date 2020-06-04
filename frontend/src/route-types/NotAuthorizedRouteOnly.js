import React, { useState, useEffect } from 'react';
import AwareComponentBuilder from '../common/AwareComponentBuilder';
import { useHistory, Route } from 'react-router-dom';
import axios from 'axios';

const NotAuthorizedRouteOnly = ({ component: Component, ...rest }) => {

    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const verify = async () => {
            if (rest.identity) {
                alert('This page requires not to be logged in. Redirecting to main page...');
                history.push('/');
                return;
            }

            const result = await axios.post('/auth/verify', {},
                { validateStatus: false })
            if (result.data?.user) {
                alert('This page requires not to be logged in. Redirecting to main page...');
                history.push('/');
                return;
            }
            setState({ loading: false });
        };

        verify();
    }, []);

    if (state.loading) return <></>
    else return <Route {...rest} render={matchProps => (
        <Component {...matchProps} />
    )} />
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(NotAuthorizedRouteOnly);