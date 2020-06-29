import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { getStatusName } from '../../../../common/utils';

const OrdersList = ({ orders, isStatusVisible = true }) => {

    const history = useHistory();

    return <>
        {
            orders.map((order, i) =>
                <div className="p-3 mb-2 border border-darken-1 preview-box" key={`o-${i}`}
                    onClick={() => history.push(`/owner/orders/${order._id}`)}>

                    <b>Id: </b>{order._id}                    
                    <br/>

                    <b>Date of order: </b>{moment(order.createdAt).format('YYYY-MM-DD HH:mm')}

                    <br />

                    <b>Restaurant: </b> {order.restaurant.name}

                    <br />

                    <b>Total Price: </b> {order.totalPrice.toFixed(2)}PLN

                    {
                        !!isStatusVisible && <>
                            <br />
                            <b>Status: </b> {getStatusName(order.status)}
                        </>
                    }
                </div>
            )
        }
    </>
};

export default OrdersList;