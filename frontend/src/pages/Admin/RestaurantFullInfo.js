import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { requestHandler } from '../../common/utils';
import { Redirect } from 'react-router-dom';
import ImagePreview from './manage/components/ImagePreview';

const RestaurantFullInfoPage = ({ match }) => {

	const restaurantId = match.params.id;

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
	return <>

		<h3 className="mb-4">Basic Info</h3>
		<div className="p-3 mb-2" style={{ border: '1px solid gray' }}>
			<p>
				<b>Id: </b> {state.restaurant._id}
			</p>

			<p>
				<b>Created At: </b> {moment(state.restaurant.createdAt).format('YYYY-MM-DD HH:mm')}
			</p>

			<p>
				<b>Name: </b> {state.restaurant.name}
			</p>

			<p>
				<b>Description: </b> {state.restaurant.description}
			</p>

			<p>
				<b>City: </b> {state.restaurant.location.city}
			</p>

			<p>
				<b>Postcode: </b> {state.restaurant.location.postcode}
			</p>

			<p>
				<b>Address: </b> {state.restaurant.location.address}
			</p>

			<p>
				<b>Contact number: </b> {state.restaurant.contactNumber}
			</p>
		</div>

		<h3 className="my-4">Gallery</h3>
		<div className="row">
			{
				state.restaurant.images.map((image, i) =>
					<ImagePreview image={image} key={`prev-${i}`} />
				)
			}
		</div>

		<h3 className="my-4">Pizzas</h3>
		{
			state.restaurant.menu.pizzas.map((pizza, i) =>
				<div className="p-3 mb-2" style={{ border: '1px solid gray' }} key={`p-${i}`}>
					<p>
						<b>Name: </b> {pizza.name}
					</p>

					<p>
						<b>Description: </b> {pizza.description}
					</p>

					<p>
						<b>Diameter: </b> {pizza.diameter} cm
        	</p>

					<p>
						<b>Price: </b> {pizza.price.toFixed(2)} PLN
        	</p>
				</div>
			)
		}

		<h3 className="my-4">Extra ingredients</h3>
		{
			state.restaurant.menu.extraIngredients.map((extraIngredient, i) =>
				<div className="p-3 mb-2" style={{ border: '1px solid gray' }} key={`e-i-${i}`}>
					<p>
						<b>Name: </b> {extraIngredient.name}
					</p>

					<p>
						<b>Price: </b> {extraIngredient.price.toFixed(2)} PLN
        	</p>
				</div>
			)
		}

		<h3 className="my-4">Extras</h3>
		{
			state.restaurant.menu.extras.map((extra, i) =>
				<div className="p-3 mb-2" style={{ border: '1px solid gray' }} key={`e-i-${i}`}>
					<p>
						<b>Name: </b> {extra.name}
					</p>

					<p>
						<b>Price: </b> {extra.price.toFixed(2)} PLN
        	</p>
				</div>
			)
		}
	</>
};

export default RestaurantFullInfoPage;