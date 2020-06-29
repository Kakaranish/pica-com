import React from 'react';
import moment from 'moment';

const RestaurantInfo = ({ restaurant, children }) => {
    return <>
        <div className="p-3 mb-3 border border-darken-1">
            <b>Name: </b>{restaurant.name}

            <div className="my-1"></div>

            <b>City: </b>{restaurant.location.city}

            <div className="my-1"></div>

            <b>Address: </b>{restaurant.location.address}

            <div className="my-1"></div>

            <b>Created At: </b>{moment(restaurant.createdAt).format('YYYY-MM-DD HH:mm')}

            <div className="mb-3"></div>

            {children}
        </div>
    </>
};

export default RestaurantInfo;