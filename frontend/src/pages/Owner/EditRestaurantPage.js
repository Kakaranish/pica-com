import React from 'react';
import { Link } from 'react-router-dom';

const EditRestaurantPage = ({ match }) => {

    const restaurantId = match.params.id;

    return <>

        <p>{restaurantId}</p>
        <Link to='/restaurant/edit/basic'>
            Edit basic info
        </Link>

        <br />

        <Link to={`/owner/restaurants/${restaurantId}/edit/gallery`}>
            Edit photo gallery
        </Link>

        <br />
    </>
};

export default EditRestaurantPage;