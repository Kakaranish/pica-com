import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { changeStatus } from './common/utils';
import { requestHandler } from '../../../common/utils';
import RestaurantOverview from '../../../common/components/RestaurantOverview';

const RestaurantOverviewPage = ({ match }) => {

	const restaurantId = match.params.id;
	const history = useHistory();

	const [state, setState] = useState({ loading: true });
	useEffect(() => {
		const fetch = async () => {
			const uri = `/admin/restaurants/${restaurantId}`;
			const action = async () => axios.get(uri, { validateStatus: false });
			const result = await requestHandler(action);
			setState({ loading: false, restaurant: result });
		};
		fetch();
	}, []);

	if (state.loading) return <></>
	else if (!state.restaurant) return <Redirect to={'/error/404'} />

	return <RestaurantOverview restaurant={state.restaurant}>
		{
			state.restaurant.status !== 'CANCELLED' &&
			<button className="btn btn-primary mr-3"
				onClick={async () => {
					await changeStatus(state.restaurant._id, 'pending');
					history.goBack();
				}}>
				Make pending
			</button>
		}

		{
			state.restaurant.status !== 'CANCELLED' &&
			<button className="btn btn-primary mr-3"
				onClick={async () => {
					await changeStatus(state.restaurant._id, 'accepted');
					history.goBack();
				}}>
				Make accepted
			</button>
		}

		{
			state.restaurant.status !== 'CANCELLED' &&
			<button className="btn btn-primary mr-3"
				onClick={async () => {
					await changeStatus(state.restaurant._id, 'rejected');
					history.goBack();
				}}>
				Make rejected
			</button>
		}
	</RestaurantOverview>
};

export default RestaurantOverviewPage;