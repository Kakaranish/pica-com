import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AuthroizedRouteOnly from '../../route-types/AuthorizedOnlyRoute';
import UsersPage from './manage/UsersPage';
import UserPage from './manage/UserPage';

const Routes = () => <>
    <Switch>
        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage/users'
            component={UsersPage} />
        <AuthroizedRouteOnly roles={['ADMIN']} path='/admin/manage/users/:id'
            component={UserPage} />
    </Switch>
</>

export default Routes;