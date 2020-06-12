import React from 'react';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import { Link, useHistory } from 'react-router-dom';
import Restaurants from './Restaurants';
import { requestHandler } from '../../../../common/utils';
import axios from 'axios';

const AcceptedRestaurants = ({ currentTab }) => {

    const history = useHistory();

    const changeStatus = async (restaurantId, status) => {
        const uri = `/admin/restaurants/${restaurantId}/status/${status}`
        const action = async () => axios.put(uri, {}, { validateStatus: false });
        await requestHandler(action);
        history.go();
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
                        Show full info
                    </Link>

                    <button className="btn btn-primary mr-2"
                        onClick={() => changeStatus(restaurant._id, 'pending')}>
                        Make Pending
                    </button>

                    <button className="btn btn-danger mr-2"
                        onClick={() => changeStatus(restaurant._id, 'rejected')}>
                        Reject
                    </button>
                </div>
            )}
        />
    </>
}

export default AcceptedRestaurants;