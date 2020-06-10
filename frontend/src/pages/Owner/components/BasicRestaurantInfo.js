import React from 'react';

const BasicRestaurantInfo = ({ restaurant }) => {
    return <>
        <div className="p-3" style={{ border: '1px solid green' }}>
            <h4>Basic restaurant info</h4>

            <p>
                <b>Restaurant: </b> {restaurant.name}
            </p>

            <p>
                <b>City: </b> {restaurant.location.city}
            </p>

            <p>
                <b>Address: </b> {restaurant.location.address}
            </p>
        </div>
    </>
}

export default BasicRestaurantInfo;