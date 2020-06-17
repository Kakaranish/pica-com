import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../common/utils';
import PizzaItem from './OrderPage/PizzaItem';
import ExtraItem from './OrderPage/ExtraItem';

const OrderPage = ({ match }) => {

	const orderId = match.params.id;

	const [state, setState] = useState({ loading: true });
	useEffect(() => {
		const fetch = async () => {
			const uri = `/orders/${orderId}`;
			const action = async () => axios.get(uri, { validateStatus: false });
			const order = await requestHandler(action);
			setState({ loading: false, order });
		};
		fetch();
	}, []);

	if (state.loading) return <></>
	else if (!state.order) return <h3>There is no such order</h3>

	return <>
		<p>
			<b>Order: </b> {orderId}
		</p>

		<p>
			<b>Created At:</b> {state.order.createdAt}
		</p>

		<p>
			<b>Restaurant: </b>&nbsp;
			<Link to={`/restaurants/${state.order.restaurant._id}`}>
				{state.order.restaurant.name}
			</Link>
		</p>

		<p>
			<b>Status: </b> {state.order.status}
		</p>

		{/* Placeholder */}
		<p>
			<Link to={'/'} className='btn btn-primary'>
				Watch order progress
			</Link>
		</p>

		<h3>Ordered Items</h3>

		<h4>Pizzas</h4>
		{
			state.order.pizzas.map((pizzaItem, i) =>
				<PizzaItem pizzaItem={pizzaItem} key={`pi-${i}`} />)
		}

		<h4>Extras</h4>
		{
			state.order.extras.map((extraItem, i) =>
				<ExtraItem extraItem={extraItem} key={`ei-${i}`} />)
		}

		<h4 className="mb-4">
			Delivery Price: {state.order.deliveryPrice.toFixed(2)}PLN
		</h4>

		<h3>
			Total Price:&nbsp;
			<span style={{ color: 'green' }}>
				{state.order.totalPrice.toFixed(2)} PLN
			</span>
		</h3>
	</>
};

export default OrderPage;