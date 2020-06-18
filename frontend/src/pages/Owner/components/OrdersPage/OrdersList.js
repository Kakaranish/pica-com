import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';

const OrdersList = ({ orders }) => {
    return <>
        {
            orders.map((order, i) =>
                <div className="p-3 mb-2" style={{ border: '1px solid red' }}
                    key={`o-${i}`}>

                    <p>
                        {moment(order.createdAt).format('YYYY-MM-DD HH:mm')}
                    </p>

                    <p>
                        Restaurant: {order.restaurant.name}
                    </p>

                    <p>
                        Total Price: {order.totalPrice.toFixed(2)}PLN
                    </p>

                    <Link to={`/owner/orders/${order._id}`} className="btn btn-primary">
                        Show
                    </Link>
                </div>
            )
        }
    </>
};

export default OrdersList;