import React from 'react';
import Restaurants from './Restaurants';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import { Link, useHistory } from 'react-router-dom';
import { changeStatus } from '../../common';

const RejectedRestaurants = ({ currentTab }) => {

    const history = useHistory();

    return <>
        <Restaurants currentTab={currentTab}
            status="rejected"
            showRestaurants={restaurants => restaurants.map((restaurant, i) =>
                <div className="p-3" style={{ border: '1px solid green' }}
                    key={`r-${i}`}>

                    <RestaurantBasicInfo restaurant={restaurant} />

                    <Link to={`/admin/manage/restaurants/${restaurant._id}`}
                        className="btn btn-primary mr-2">
                        Overview
                    </Link>

                    <button className="btn btn-primary mr-2"
                        onClick={async () => {
                            await changeStatus(restaurant._id, 'pending');
                            history.go();
                        }}>
                        Make Pending
                    </button>

                    <button className="btn btn-success mr-2"
                        onClick={async () => {
                            await changeStatus(restaurant._id, 'accepted');
                            history.go();
                        }}>
                        Accept
                    </button>
                </div>
            )}
        />
    </>
};

export default RejectedRestaurants;