import React from 'react';
import { Switch } from 'react-router-dom';
import AuthroizedRouteOnly from '../../route-types/AuthorizedOnlyRoute';
import UsersPage from './manage/UsersPage';
import EditUserPage from './manage/EditUserPage';
import RestaurantsPage from './manage/RestaurantsPage';

const Routes = () => <>
    <Switch>
        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage/users'
            component={UsersPage} />
        <AuthroizedRouteOnly roles={['ADMIN']} path='/admin/manage/users/:id'
            component={EditUserPage} />
        
        <AuthroizedRouteOnly roles={['ADMIN']} path='/admin/manage/restaurants'
            component={RestaurantsPage} />
    </Switch>
</>

export default Routes;