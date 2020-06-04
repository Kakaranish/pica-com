import React from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import AwareComponentBuilder from '../../common/AwareComponentBuilder';

const SuccessPage = (props) => {

    const queryParams = queryString.parse(props.location.search);
    props.setIdentity({
        email: queryParams.email,
        firstName: queryParams.firstName,
        lastName: queryParams.lastName,
        role: queryParams.role,
    });

    return <Redirect to={'/'} />
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(SuccessPage);