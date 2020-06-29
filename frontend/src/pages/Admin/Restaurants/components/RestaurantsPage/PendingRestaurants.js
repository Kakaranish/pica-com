import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import Restaurants from './Restaurants';
import { changeStatus } from '../../common/utils';

const PendingRestaurants = ({ currentTab }) => {

	const history = useHistory();

	const onAccept = async restaurant => {
		await changeStatus(restaurant._id, 'accepted');
		history.push('/refresh');
	};

	const onReject = async restaurant => {
		await changeStatus(restaurant._id, 'rejected');
		history.push('/refresh');
	};

	return <>
		<Restaurants currentTab={currentTab}
			status="pending"
			showRestaurants={restaurants => restaurants.map((restaurant, i) =>
				<div className="p-3 border border-darken-1 item-box"
					key={`r-${i}`}>

					<RestaurantBasicInfo restaurant={restaurant} />

					<div className="mt-3">
						<Link to={`/admin/manage/restaurants/${restaurant._id}`}
							className="btn btn-primary mr-2">
							Overview
						</Link>

						<button className="btn btn-primary mr-2"
							onClick={() => onAccept(restaurant)}>
							Accept
						</button>

						<button className="btn btn-primary mr-2"
							onClick={() => onReject(restaurant)}>
							Reject
						</button>
					</div>
				</div>
			)}
		/>
	</>
}

export default PendingRestaurants;