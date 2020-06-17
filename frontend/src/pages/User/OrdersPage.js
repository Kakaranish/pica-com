import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { requestHandler } from '../../common/utils';
import { Link } from 'react-router-dom';

const OrdersPage = () => {

	const [state, setState] = useState({ loading: true });
	useEffect(() => {
		const fetch = async () => {
			const action = async () => axios.get('/orders', { validateStatus: false });
			const orders = await requestHandler(action);
			setState({ loading: false, orders });
		};
		fetch();
	}, []);

	if (state.loading) return <></>
	else if (!state.orders) return <>
		You have no orders yet
	</>

	return <>
		{
			state.orders.map((order, i) =>
				<div className="p-3 mb-2" style={{ border: '1px solid red' }} key={`o-${i}`}>
					<p>
						{moment(order.createdAt).format('YYYY-MM-DD HH:mm')}
					</p>

					<p>
						Restaurant: {order.restaurant.name}
					</p>

					<p>
						Status: {order.status}
					</p>

					<p>
						Total Price: {order.totalPrice.toFixed(2)}PLN
					</p>

					<Link to={`/user/orders/${order._id}`} className="btn btn-primary">
						Show
					</Link>
				</div>
			)
		}
	</>
};

export default OrdersPage;