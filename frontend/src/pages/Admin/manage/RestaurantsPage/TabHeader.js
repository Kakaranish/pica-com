import React from 'react';

const TabHeader = ({ title, uniqueInitial, setCurrentTab, currentTab }) => {

    const selected = currentTab === uniqueInitial;
    return <>
        <a className={`nav-item nav-link ${selected ? 'active' : ''}`}
            id={`${uniqueInitial}-tab`}
            href={`#${uniqueInitial}`}
            aria-controls={`${uniqueInitial}`}
            data-toggle="tab"
            role="tab"
            aria-selected={selected}
            onClick={() => setCurrentTab(uniqueInitial)}>

            {title}

        </a>
    </>
}

export default TabHeader;