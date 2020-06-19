import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const OrdersList = ({ orders }) => {

    const statuses = {
        IN_PREPARATION: 'In preparation',
        IN_DELIVERY: 'In delivery'
    };

    return <>
        {
            orders.map((order, i) =>
                <div className="p-3 mb-2 border border-darken-1" key={`o-${i}`}>

                    <b>Date of order: </b>{moment(order.createdAt).format('YYYY-MM-DD HH:mm')}

                    <br />

                    <b>Restaurant: </b> {order.restaurant.name}

                    <br />

                    <b>Total Price: </b> {order.totalPrice.toFixed(2)}PLN

                    <br />

                    <b>Status: </b> {statuses[order.status]}

                    <div className="mt-2"></div>

                    <Link to={`/owner/orders/${order._id}`} className="btn btn-primary">
                        Show
                    </Link>
                </div>
            )
        }
    </>
};

export default OrdersList;