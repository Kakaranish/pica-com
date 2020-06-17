import React from 'react';

const ExtraItem = ({ extraItem }) => {
    return <>
        <div className="p-3 mb-2" style={{ border: '1px solid green' }}>
            <p>
                <b>Name</b>: {extraItem.extra.name}&nbsp;
                ({extraItem.extra.price.toFixed(2)} PLN)
            </p>
        </div>
    </>
};

export default ExtraItem;