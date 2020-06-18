import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { requestHandler, getFormDataJsonFromEvent } from '../../common/utils';
import OrderedItems from './OrderPage/OrderedItems';
import DeliveryAddressForm from './OrderPage/DeliveryAddressForm';

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

		<b>Status: </b> {state.order.status} <br />

		<div className="py-2">
			<b>Payment status: </b>
			<span style={{ color: 'red' }}>Not paid</span><br />

			<Link to={`/user/orders/${orderId}/pay`} className="btn btn-success">
				Pay
			</Link>
		</div>

		<div className="py-2 mb-2">
			<b>Delivery address: </b>
			<span style={{ color: 'red' }}>Not provided</span><br />

			<br/>
			<DeliveryAddressForm order={state.order} onSubmit={async event => {
				event.preventDefault();
				const formData = getFormDataJsonFromEvent(event);
				console.log(formData);
			}}>
				<button className="btn btn-primary">
					Submit
				</button>
			</DeliveryAddressForm>
		</div>

		<OrderedItems order={state.order} />

	</>
};

export default OrderPage;