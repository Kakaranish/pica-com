import React from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import { getStatusName } from '../../../../common/utils';

const OrdersList = ({ orders, isStatusVisible = true }) => {

    const history = useHistory();

    if(!orders?.length) return <h3>Nothing here</h3>

    return <>
        {
            orders.map((order, i) =>
                <div className="p-3 mb-3 border border-darken-1 preview-box" key={`o-${i}`}
                    onClick={() => history.push(`/owner/orders/${order._id}`)}>

                    <b>Id: </b>{order._id}                    
                    <div className="my-1"></div>

                    <b>Date of order: </b>{moment(order.createdAt).format('YYYY-MM-DD HH:mm')}

                    <div className="my-1"></div>

                    <b>Restaurant: </b> {order.restaurant.name}

                    <div className="my-1"></div>

                    <b>Total Price: </b> {order.totalPrice.toFixed(2)}PLN

                    {
                        !!isStatusVisible && <>
                            <div className="my-1"></div>
                            <b>Status: </b> {getStatusName(order.status)}
                        </>
                    }
                </div>
            )
        }
    </>
};

export default OrdersList;