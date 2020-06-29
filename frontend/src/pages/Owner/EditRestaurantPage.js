import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../common/utils';
import ImagePreview from '../../common/components/ImagePreview';

const EditRestaurantPage = ({ match }) => {

    const restaurantId = match.params.id;

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const uri = `/owner/restaurants/${restaurantId}`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const restaurant = await requestHandler(action);
            setState({ loading: false, restaurant });
        };
        fetch();
    }, []);

    if (state.loading) return <></>
    else if (!state.restaurant) return <h3>There is no such restaurant</h3>

    return <>
        <h3>Edit restaurant "{state.restaurant.name}"</h3>
        <p>
            <b>Location: </b>
            {state.restaurant.location.city},&nbsp;
            {state.restaurant.location.postcode},&nbsp;
            {state.restaurant.location.address}
        </p>
        
        {
            state.restaurant.images?.length > 0 &&
            <div className="row">
                {
                    state.restaurant.images.map((image, i) =>
                        <ImagePreview image={image} key={`prev-${i}`} />
                    )
                }
            </div>
        }

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

        <p>
            <Link to={`/owner/restaurants/${restaurantId}/edit/menu`}>
                Edit menu
            </Link>
        </p>

        <p>
            <Link to={`/owner/restaurants/${restaurantId}/edit/delivery`}>
                Edit delivery
            </Link>
        </p>
    </>
};

export default EditRestaurantPage;