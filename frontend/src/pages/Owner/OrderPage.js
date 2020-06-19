import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { requestHandler } from '../../common/utils';
import { useHistory } from 'react-router-dom';
import DeliveryAddress from '../../common/components/Order/DeliveryAddress';
import OrderedItems from '../../common/components/Order/OrderedItems';

const OrderPage = ({ match }) => {

    const orderId = match.params.id;
    const history = useHistory();

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const uri = `/owner/orders/${orderId}`;
            const action = async () => axios.get(uri, { validateStatus: false });
            const order = await requestHandler(action);
            setState({ loading: false, order });
        };
        fetch();
    }, []);

    const statuses = {
        IN_PREPARATION: {
            nextStatus: 'IN_DELIVERY',
            label: 'In preparation'
        },
        IN_DELIVERY: {
            nextStatus: 'COMPLETED',
            label: 'In delivery'
        },
        COMPLETED: {
            label: 'Completed'
        }
    };

    const onStatusChange = async () => {
        const nextStatus = statuses[state.order.status].nextStatus;
        if (!nextStatus) return;

        const uri = `/owner/orders/${orderId}/status/${nextStatus}`;
        const action = async () => axios.put(uri, {}, { validateStatus: false });
        await requestHandler(action, {
            status: 200,
            callback: async () => {
                toast('Order status changed');
                history.push('/refresh');
            }
        })
    };

    if (state.loading) return <></>
    else if (!state.order) return <h3>No such order</h3>

    return <>
        <p>
            <b>Order: </b> {orderId}
        </p>

        <p>
            <b>Last status change: </b>
            {moment(state.order.updatedAt).format('YYYY-MM-DD HH:mm')}
        </p>

        <p>
            <b>Status: </b> {state.order.status}
        </p>

        {
            ["IN_PREPARATION", "IN_DELIVERY"].includes(state.order.status) && <>
                <button className="btn btn-primary" onClick={onStatusChange}>
                    Make "{statuses[state.order.status].nextStatus}"
                </button>
            </>
        }

        <div className="mt-4"></div>
        <DeliveryAddress address={state.order.deliveryAddress} />

        <div className="mb-3"></div>

        <OrderedItems order={state.order} />
    </>
};

export default OrderPage;