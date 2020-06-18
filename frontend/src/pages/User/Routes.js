import React from 'react';
import { Switch } from 'react-router-dom';
import AuthorizedOnlyRoute from '../../route-types/AuthorizedOnlyRoute';
import OrdersPage from './OrdersPage';
import OrderPage from './OrderPage';
import OrderDeliveryAddressPage from './OrderDeliveryAddressPage';

const Routes = () => <>
    <Switch>
        <AuthorizedOnlyRoute exact path='/user/orders' component={OrdersPage} />
        <AuthorizedOnlyRoute path='/user/orders/:id/step/delivery-address'
            component={OrderDeliveryAddressPage} />
        <AuthorizedOnlyRoute path='/user/orders/:id' component={OrderPage} />
    </Switch>
</>

export default Routes;