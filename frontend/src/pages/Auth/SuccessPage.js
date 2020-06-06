import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import axios from 'axios';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const SuccessPage = (props) => {


    const [state, setState] = useState({ loading: true });
    const queryParams = queryString.parse(props.location.search);

    useEffect(() => {
        const fetch = async () => {
            
            const fetchNotifsResult = await axios.get('/notifications');
            if(fetchNotifsResult.status !== 200) {
                alert('Unknown error');
                console.log(fetchNotifsResult.data);
                setState({loading: false});
                return;
            }

            props.setNotifs(fetchNotifsResult.data.map(notif => notif._id));
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