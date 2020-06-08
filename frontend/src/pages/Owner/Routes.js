import React from 'react';
import { Switch } from 'react-router-dom';
import AuthorizedOnlyRoute from '../../route-types/AuthorizedOnlyRoute';
import RestaurantsPage from './RestaurantsPage';

const Routes = () => <>
    <Switch>
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants'
            component={RestaurantsPage} />
    </Switch>
</>

export default Routes;