import React from 'react';
import AwareComponentBuilder from '../common/AwareComponentBuilder';

const Navbar = (props) => {
    return <>
        <div style={{ border: "1px solid red" }}>
            {
                props.identity &&
                <p>{props.identity.firstName} {props.identity.lastName} ({props.identity.email})</p>

            }
        </div>
    </>
};

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(Navbar);