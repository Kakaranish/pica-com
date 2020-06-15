import React from 'react';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import { Link, useHistory } from 'react-router-dom';
import Restaurants from './Restaurants';
import { changeStatus } from '../../common/utils';

const AcceptedRestaurants = ({ currentTab }) => {

    const history = useHistory();

    const onMakePending = async restaurant => {
        await changeStatus(restaurant._id, 'pending');
        history.push('/refresh');
    };

    const onReject = async restaurant => {
        await changeStatus(restaurant._id, 'rejected');
        history.push('/refresh');
    };

    return <>
        <Restaurants currentTab={currentTab}
            status="accepted"
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
                        onClick={() => onReject(restaurant)}>
                        Reject
                    </button>
                </div>
            )}
        />
    </>
}

export default AcceptedRestaurants;