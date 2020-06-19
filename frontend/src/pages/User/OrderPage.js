import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestHandler } from '../../common/utils';
import OrderedItems from './OrderPage/OrderedItems';
import DeliveryStatus from './OrderPage/OrderStatus';
import DeliveryAddress from './OrderPage/DeliveryAddress';

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
		<b>Order: </b> {orderId} <br />

		<b>Created At:</b> {state.order.createdAt} <br />

		<b>Restaurant: </b>&nbsp;
		<Link to={`/restaurants/${state.order.restaurant._id}`}>
			{state.order.restaurant.name}
		</Link>
		
		<br />

		<DeliveryStatus order={state.order} />

		<div className="mb-3"></div>

		<DeliveryAddress address={state.order.deliveryAddress} />

		<div className="mb-3"></div>

		<OrderedItems order={state.order} />
	</>
};

export default OrderPage;