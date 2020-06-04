import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import SuccessPage from './SuccessPage';

const Routes = () => <>
    <Switch>
        <Route path='/auth/success' component={SuccessPage} />
        <Route path='/auth/login' component={LoginPage} />
        <Route path='/auth/register' component={RegisterPage} />
    </Switch>
</>

export default Routes;