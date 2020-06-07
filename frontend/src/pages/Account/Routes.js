import React from 'react';
import { Switch } from 'react-router-dom';
import AuthroizedRouteOnly from '../../route-types/AuthorizedOnlyRoute';
import GeneralInfoPage from './GeneralInfoPage';
import EditProfilePage from './EditProfilePage';
import ChangePasswordPage from './ChangePasswordPage';
import EditAddressPage from './EditAddressPage';

const Routes = () => <>
    <Switch>
        <AuthroizedRouteOnly exact path='/account' component={GeneralInfoPage} />
        <AuthroizedRouteOnly exact path='/account/edit/profile' component={EditProfilePage} />
        <AuthroizedRouteOnly exact path='/account/edit/password' component={ChangePasswordPage} />
        <AuthroizedRouteOnly exact path='/account/edit/address' component={EditAddressPage} />
    </Switch>
</>

export default Routes;