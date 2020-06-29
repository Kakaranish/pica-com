import React from 'react';
import moment from 'moment';

const RestaurantBasicInfo = ({ restaurant }) => {
    return <>
        <div>
            <b>Owner: </b> {restaurant.owner.firstName} {restaurant.owner.lastName}
            <br/>

            <b>Name: </b> {restaurant.name}
            <br/>

            <b>Description: </b> {restaurant.description}
            <br/>

            <b>Created at: </b> {moment(restaurant.createdAt).format('YYYY-MM-DD HH:mm')}
            <br/>
        </div>
    </>
};

export default RestaurantBasicInfo;