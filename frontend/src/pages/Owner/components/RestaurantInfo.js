import React from 'react';
import moment from 'moment';

const RestaurantInfo = ({ restaurant, children }) => {
    return <>
        <div className="p-3 mb-2 border border-darken-1">
            <b>Name: </b>{restaurant.name}

            <br />

            <b>City: </b>{restaurant.location.city}

            <br />

            <b>Address: </b>{restaurant.location.address}

            <br />

            <b>Created At: </b>{moment(restaurant.createdAt).format('YYYY-MM-DD HH:mm')}

            <div className="mb-3"></div>

            {children}
        </div>
    </>
};

export default RestaurantInfo;