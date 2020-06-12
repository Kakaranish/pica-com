import React from 'react';
import { Link } from 'react-router-dom';
import RestaurantBasicInfo from './RestaurantBasicInfo';
import Restaurants from './Restaurants';

const PendingRestaurants = ({ currentTab }) => <>
	<Restaurants currentTab={currentTab}
		status="pending"
		showRestaurants={restaurants => restaurants.map((restaurant, i) =>
			<div className="p-3" style={{ border: '1px solid green' }}
				key={`r-${i}`}>

				<RestaurantBasicInfo restaurant={restaurant} />

				<Link to={`/admin/manage/restaurants/${restaurant._id}`}
					className="btn btn-primary mr-2">
					Show full info
					</Link>

				<button className="btn btn-success mr-2">
					Accept
					</button>

				<button className="btn btn-danger mr-2">
					Reject
					</button>
			</div>
		)}
	/>
</>

export default PendingRestaurants;