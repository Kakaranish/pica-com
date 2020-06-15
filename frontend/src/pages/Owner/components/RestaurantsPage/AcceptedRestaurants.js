import React from 'react';
import RestaurantInfo from '../RestaurantInfo';
import { useHistory, Link } from 'react-router-dom';
import { changeStatus, editPrompt } from '../../common/utils';

const AcceptedRestaurants = ({ restaurants }) => {

    const history = useHistory();

    const onEdit = async restaurantId => {
        const result = await editPrompt(restaurantId);
        if (result) history.push(`/owner/restaurants/${restaurantId}/edit`);
    };

    const onMakeDraft = async restaurant => {
        await changeStatus(restaurant._id, 'draft');
        history.push('/refresh');
    };

    const onMakeCancelled = async restaurant => {
        await changeStatus(restaurant._id, 'cancelled');
        history.push('/refresh');
    };

    if (!restaurants?.length) return <h3>No restaurants</h3>
    return <>
        {
            restaurants.map((restaurant, i) =>
                <RestaurantInfo restaurant={restaurant} key={`p-${i}`}>
                    <Link to={`/owner/restaurants/${restaurant._id}`}
                        className="btn btn-primary mr-3">
                        Overview
                    </Link>

                    <button className="btn btn-primary mr-3"
                        onClick={async () => onEdit(restaurant._id)}>
                        Edit
                    </button>

                    <button className="btn btn-primary mr-3"
                        onClick={() => onMakeDraft(restaurant)}>
                        Make draft
                    </button>

                    <button className="btn btn-primary mr-3"
                        onClick={() => onMakeCancelled(restaurant)}>
                        Make cancelled
                    </button>
                </RestaurantInfo>
            )
        }
    </>
};

export default AcceptedRestaurants;