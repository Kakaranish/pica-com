import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { requestHandler, getStatusName } from '../../common/utils';
import { useHistory } from 'react-router-dom';

const OrdersPage = () => {

	const history = useHistory();

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
	else if (!state.orders?.length) return <h3>
		You have no orders yet
	</h3>

	return <>
		<h3 className="mb-3">Your orders</h3>
		{
			state.orders.map((order, i) =>
				<div className="p-3 mb-2 border border-darken-1 preview-box" key={`o-${i}`}
					onClick={() => history.push(`/user/orders/${order._id}`)}>

					<div className="mb-2">
						<b>Date of order: </b>
						{moment(order.createdAt).format('YYYY-MM-DD HH:mm')}
						<br />

						<b>Restaurant: </b>{order.restaurant.name}
						<br />

						<b>Status: </b>
						{getStatusName(order.status)}
						<br />

						<b>Total Price: </b>
						{order.totalPrice.toFixed(2)}PLN
						<br />
					</div>
				</div>
			)
		}
	</>
};

export default OrdersPage;