import React from 'react';

const SearchLayout = () => {
    return <>
        <div className="container">
            <div className="p-3">
                {props.children}
            </div>
        </div>
    </>
};

export default SearchLayout;