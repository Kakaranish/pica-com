import React from 'react';

const TabHeader = ({ title, uniqueInitial, isSelected }) => <>
    <a className={`nav-item nav-link ${!!isSelected ? 'active' : null}`}
        id={`${uniqueInitial}-tab`}
        data-toggle="tab" href={`#${uniqueInitial}`} role="tab"
        aria-controls={`${uniqueInitial}`} aria-selected={!!isSelected}>
        {title}
    </a>
</>

export default TabHeader;