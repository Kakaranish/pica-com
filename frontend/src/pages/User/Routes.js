import React from 'react';
import { Switch } from 'react-router-dom';
import AuthorizedOnlyRoute from '../../route-types/AuthorizedOnlyRoute';
import OrdersPage from './OrdersPage';
import OrderPage from './OrderPage';
import PayPage from './PayPage';
import OrderDeliveryAddressPage from './OrderDeliveryAddressPage';
import OrderPaymentPage from './OrderPaymentPage';

const Routes = () => <>
    <Switch>
        <AuthorizedOnlyRoute exact path='/user/orders' component={OrdersPage} />
        <AuthorizedOnlyRoute path='/user/orders/:id/step/delivery-address'
            component={OrderDeliveryAddressPage} />
        <AuthorizedOnlyRoute path='/user/orders/:id/step/payment'
            component={OrderPaymentPage} />
        <AuthorizedOnlyRoute path='/user/orders/:id/pay' component={PayPage} />
        <AuthorizedOnlyRoute path='/user/orders/:id' component={OrderPage} />
    </Switch>
</>

export default Routes;