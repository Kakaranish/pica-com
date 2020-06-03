import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';

const Routes = () => <>
    <Switch>
        <Route path='/auth/login' component={LoginPage} />
        <Route path='/auth/register' component={RegisterPage} />
    </Switch>
</>

export default Routes;