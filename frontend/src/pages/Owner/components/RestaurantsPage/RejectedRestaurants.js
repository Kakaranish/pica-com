import React from 'react';
import { Link } from 'react-router-dom';
import RestaurantInfo from '../RestaurantInfo';

const RejectedRestaurants = ({ restaurants }) => {

    if (!restaurants?.length) return <h3>No restaurants</h3>
    return <>
        {
            restaurants.map((restaurant, i) =>
                <RestaurantInfo restaurant={restaurant} key={`p-${i}`}>
                    <Link to={`/owner/restaurants/${restaurant._id}`}
                        className="btn btn-primary mr-3">
                        Overview
                    </Link>
                </RestaurantInfo>
            )
        }
    </>
};

export default RejectedRestaurants;