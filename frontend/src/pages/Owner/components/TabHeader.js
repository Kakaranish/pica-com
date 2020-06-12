import React from 'react';

const TabHeader = ({ title, uniqueInitial, isActive }) => {

    return <>
        <a className={`nav-item nav-link ${isActive ? 'active' : ''}`}
            id={`${uniqueInitial}-tab`}
            data-toggle="tab"
            href={`#${uniqueInitial}`} role="tab"
            aria-controls={`${uniqueInitial}`}
            aria-selected={isActive}>

            {title}

        </a>
    </>
};

export default TabHeader;