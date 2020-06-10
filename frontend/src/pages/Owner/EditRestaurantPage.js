import React from 'react';
import { Link } from 'react-router-dom';

const EditRestaurantPage = ({ match }) => {

    const restaurantId = match.params.id;

    return <>
        <p>
            <Link to={`/owner/restaurants/${restaurantId}/edit/basic`}>
                Edit basic info
            </Link>
        </p>

        <p>
            <Link to={`/owner/restaurants/${restaurantId}/edit/gallery`}>
                Edit photo gallery
            </Link>
        </p>

        <br />
    </>
};

export default EditRestaurantPage;