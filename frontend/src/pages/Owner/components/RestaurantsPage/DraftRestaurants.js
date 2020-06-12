import React from 'react';
import RestaurantInfo from '../RestaurantInfo';
import { Link, useHistory } from 'react-router-dom';
import { changeStatus } from '../../common';

const DraftRestaurants = ({ restaurants }) => {

    const history = useHistory();

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
                        onClick={() => {
                            changeStatus(restaurant._id, "pending");
                            history.go();
                        }}>
                        Make Pending
                    </button>

                    <button className="btn btn-primary mr-3"
                        onClick={() => {
                            changeStatus(restaurant._id, "cancelled");
                            history.go();
                        }}>
                        Make Cancelled
                    </button>
                </RestaurantInfo>
            )
        }
    </>
};

export default DraftRestaurants;