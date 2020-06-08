import React from 'react';

const ErrorPage = ({ match }) => {

    const code = match.params.code;

    if (!code) return <h3>Unknown error</h3>
    else if (code == 404) return <>
        <h2>404</h2>
        <h2>This page appears to be lost in the infinite <code>void**</code> :((</h2>
    </>
    else return <>
        <h3>Error {code} </h3>
        <h3>Unknown error occured</h3>
    </>
};

export default ErrorPage;