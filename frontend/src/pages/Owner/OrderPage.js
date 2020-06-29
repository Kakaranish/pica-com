import React, { useEffect, useState } from 'react';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { requestHandler, getStatusName } from '../../common/utils';
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

    const nextStatus = {
        IN_PREPARATION: 'IN_DELIVERY',
        IN_DELIVERY: 'COMPLETED',
        COMPLETED: null
    };

    const onStatusChange = async () => {
        const next = nextStatus[state.order.status];
        if (!next) return;

        const uri = `/owner/orders/${orderId}/status/${next}`;
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

        <h3>Order '{orderId}'</h3>

        <b>Last status change: </b>
        {moment(state.order.updatedAt).format('YYYY-MM-DD HH:mm')}
        <br />

        <b>
            Status: <span className="text-success">
                {getStatusName(state.order.status)}
            </span>
        </b>
        <br/>

        {
            ["IN_PREPARATION", "IN_DELIVERY"].includes(state.order.status) && <>
                <button className="btn btn-primary mt-3" onClick={onStatusChange}>
                    Make&nbsp;
                    <b>{getStatusName(nextStatus[state.order.status])}</b>
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