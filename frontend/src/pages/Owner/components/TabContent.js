import React from 'react';

const TabContent = ({ children, uniqueInitial, isActive }) => {
    return <>
        <div className={`tab-pane fade show p-3 ${isActive ? 'active' : ''}`}
            id={`${uniqueInitial}`} 
            role="tabpanel"
            aria-labelledby={`${uniqueInitial}-tab`}>

            {children}

        </div>
    </>
};

export default TabContent;