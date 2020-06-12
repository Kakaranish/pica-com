import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { changeStatus, editPrompt } from '../../common/utils';
import RestaurantInfo from '../RestaurantInfo';

const CancelledRestaurans = ({ restaurants }) => {

    const history = useHistory();

    const onEdit = async restaurantId => {
        const result = await editPrompt(restaurantId);
        if (result) history.push(`/owner/restaurants/${restaurantId}/edit`);
    }

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
                        onClick={async () => {
                            await changeStatus(restaurant._id, 'draft');
                            history.go();
                        }}>
                        Make Draft
                    </button>

                    <button className="btn btn-primary mr-3"
                        onClick={async () => {
                            await changeStatus(restaurant._id, 'pending');
                            history.go();
                        }}>
                        Make Pending
                    </button>
                </RestaurantInfo>
            )
        }
    </>
};

export default CancelledRestaurans;