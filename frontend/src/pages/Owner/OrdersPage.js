import React, { useEffect, useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { requestHandler } from '../../common/utils';
import TabHeader from './components/TabHeader';
import TabContent from './components/TabContent';
import OrdersList from './components/OrdersPage/OrdersList';

const OrdersPage = () => {

    const [state, setState] = useState({ loading: true });
    useEffect(() => {
        const fetch = async () => {
            const action = async () => axios.get('/owner/orders',
                { validateStatus: false });
            const orders = await requestHandler(action, {
                status: 400,
                callback: async res => console.log(res)
            });
            setState({ loading: false, orders });
        };
        fetch();
    }, []);

    if (state.loading) return <></>
    else if (!state.orders.length) return <h3>No orders</h3>

    const inProgress = state.orders.filter(order =>
        order.status === 'IN_PREPARATION' ||
        (order.status === 'IN_DELIVERY' && moment().isBefore(
            moment(order.estimatedDeliveryTime))));
    const completed = state.orders.filter(order => order.status === 'COMPLETED' ||
        (order.status === 'IN_DELIVERY' && moment().isAfter(
            moment(order.estimatedDeliveryTime))));

    return <>
        <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <TabHeader title='In Progress' uniqueInitial='nav-in-progress'
                isActive={true} />
            <TabHeader title='Completed' uniqueInitial='nav-completed' />
        </div>

        <div className="tab-content">
            <TabContent uniqueInitial='nav-in-progress' isActive={true}>
                <OrdersList orders={inProgress} />
            </TabContent>

            <TabContent uniqueInitial='nav-completed'>
                <OrdersList orders={completed} />
            </TabContent>
        </div>
    </>
};

export default OrdersPage;