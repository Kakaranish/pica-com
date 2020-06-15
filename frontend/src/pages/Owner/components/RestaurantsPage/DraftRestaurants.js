import React from 'react';
import RestaurantInfo from '../RestaurantInfo';
import { Link, useHistory } from 'react-router-dom';
import { changeStatus } from '../../common/utils';

const DraftRestaurants = ({ restaurants }) => {

    const history = useHistory();

    const onEdit = restaurantId =>
        history.push(`/owner/restaurants/${restaurantId}/edit`);

    const onMakePending = async restaurant => {
        await changeStatus(restaurant._id, "pending");
        history.push('/refresh');
    };

    const onMakeCancelled = async restaurant => {
        await changeStatus(restaurant._id, "cancelled");
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
                        onClick={() => onMakePending(restaurant)}>
                        Make Pending
                    </button>

                    <button className="btn btn-primary mr-3"
                        onClick={() => onMakeCancelled(restaurant)}>
                        Make Cancelled
                    </button>
                </RestaurantInfo>
            )
        }
    </>
};

export default DraftRestaurants;