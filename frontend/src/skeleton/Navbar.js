import React from 'react';
import NotifIndicator from './NotifiIndicator';
import AwareComponentBuilder from '../common/AwareComponentBuilder';

const Navbar = (props) =>
    <div className="p-3" style={{ border: "1px solid red" }}>
        {
            props.identity &&
            <>{props.identity.firstName} {props.identity.lastName} ({props.identity.email})</>
        }

        {
            props.identity &&
            <span className="ml-3">
                <NotifIndicator />
            </span>
        }

    </div>

export default new AwareComponentBuilder()
    .withIdentityAwareness()
    .build(Navbar);