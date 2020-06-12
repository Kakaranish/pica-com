import React from 'react';
import moment from 'moment';

const RestaurantBasicInfo = ({ restaurant }) => {
    return <>
        <div>
            <p>
                <b>Owner: </b> {restaurant.owner.firstName} {restaurant.owner.lastName}
            </p>

            <p>
                <b>Name: </b> {restaurant.name}
            </p>

            <p>
                <b>Description: </b> {restaurant.description}
            </p>

            <p>
                <b>Created at: </b> {moment(restaurant.createdAt).format('YYYY-MM-DD HH:mm')}
            </p>
        </div>
    </>
};

export default RestaurantBasicInfo;