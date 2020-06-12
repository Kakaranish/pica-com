import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import Restaurants from './Restaurants';
import axios from 'axios';
import { requestHandler } from '../../../../common/utils';

const PendingRestaurants = ({ currentTab }) => {

	const history = useHistory();

	const changeStatus = async (restaurantId, status) => {
        const uri = `/admin/restaurants/${restaurantId}/status/${status}`
        const action = async () => axios.put(uri, {}, { validateStatus: false });
        await requestHandler(action);
        history.go();
    };

	return <>
		<Restaurants currentTab={currentTab}
			status="pending"
			showRestaurants={restaurants => restaurants.map((restaurant, i) =>
				<div className="p-3" style={{ border: '1px solid green' }}
					key={`r-${i}`}>

					<RestaurantBasicInfo restaurant={restaurant} />

					<Link to={`/admin/manage/restaurants/${restaurant._id}`}
						className="btn btn-primary mr-2">
						Overview
					</Link>

					<button className="btn btn-success mr-2"
						onClick={() => {
							changeStatus(restaurant._id, 'accepted');
							history.go();
						}}>
						Accept
					</button>

					<button className="btn btn-danger mr-2"
						onClick={() => {
							changeStatus(restaurant._id, 'rejected');
							history.go();
						}}>
						Reject
					</button>
				</div>
			)}
		/>
	</>
}

export default PendingRestaurants;