import React from 'react';

const RestaurantsTab = ({ title, status, isSelected }) => {

    const initial = `nav-${status?.toLowerCase()}`

    return <>
        <a className={`nav-item nav-link ${!!isSelected ? 'active' : null}`}
            id={`${initial}-tab`}
            data-toggle="tab" href={`#${initial}`} role="tab"
            aria-controls={`${initial}`} aria-selected={!!isSelected}>
            {title}
        </a>
    </>
};

export default RestaurantsTab;