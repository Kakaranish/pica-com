import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import Restaurants from './Restaurants';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import { changeStatus } from '../../common/utils';

const RejectedRestaurants = ({ currentTab }) => {

    const history = useHistory();

    const onMakePending = async restaurant => {
        await changeStatus(restaurant._id, 'pending');
        history.push('/refresh');
    };

    const onAccept = async restaurant => {
        await changeStatus(restaurant._id, 'accepted');
        history.push('/refresh');
    };

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
                        onClick={() => onMakePending(restaurant)}>
                        Make Pending
                    </button>

                    <button className="btn btn-primary mr-2"
                        onClick={() => onAccept(restaurant)}>
                        Accept
                    </button>
                </div>
            )}
        />
    </>
};

export default RejectedRestaurants;