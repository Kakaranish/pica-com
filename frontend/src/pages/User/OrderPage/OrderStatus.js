import React from 'react';
import { Link } from 'react-router-dom';
import { getStatusName } from '../../../common/utils';

const DeliveryStatus = ({ order }) => {
	
	let continueUri;
	if (!order.deliveryAddress)
		continueUri = `/user/orders/${order._id}/step/delivery-address`;
	else if (!order.payment)
		continueUri = `/user/orders/${order._id}/step/payment`;

	if (!continueUri) return <>
		<b>
			Status:&nbsp;
			<span style={{ color: 'green' }}>
				{getStatusName(order.status)}
			</span>
		</b>

		<br />
	</>

	return <>
		<Link to={continueUri} className="btn btn-success w-25">
			Continue Placing an Order
		</Link>
	</>
};

export default DeliveryStatus;