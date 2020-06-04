import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import SuccessPage from './SuccessPage';
import NotAuthorizedRouteOnly from '../../route-types/NotAuthorizedRouteOnly';

const Routes = () => <>
    <Switch>
        <Route path='/auth/success' component={SuccessPage} />
        <NotAuthorizedRouteOnly path='/auth/login' component={LoginPage} />
        <NotAuthorizedRouteOnly path='/auth/register' component={RegisterPage} />
    </Switch>
</>

export default Routes;