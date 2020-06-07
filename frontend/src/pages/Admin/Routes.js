import React from 'react';
import { Switch } from 'react-router-dom';
import AuthroizedRouteOnly from '../../route-types/AuthorizedOnlyRoute';
import UsersPage from './manage/UsersPage';
import EditUserPage from './manage/EditUserPage';

const Routes = () => <>
    <Switch>
        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage/users'
            component={UsersPage} />
        <AuthroizedRouteOnly roles={['ADMIN']} path='/admin/manage/users/:id'
            component={EditUserPage} />
    </Switch>
</>

export default Routes;