import React from 'react';

const RestaurantInfo = ({ restaurant, children }) => {
    return <>
        <div className="p-3 mb-2" style={{ border: '1px solid red' }}>
            <p>
                <b>Name: </b>{restaurant.name}
            </p>

            <p>
                <b>City: </b>{restaurant.location.city}
            </p>

            <p>
                <b>Address: </b>{restaurant.location.address}
            </p>

            <p>
                <b>Created At: </b>{restaurant.createdAt}
            </p>

            {children}
        </div>
    </>
};

export default RestaurantInfo;