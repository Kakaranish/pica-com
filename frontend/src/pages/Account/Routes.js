import React from 'react';
import { Switch } from 'react-router-dom';
import AuthroizedRouteOnly from '../../route-types/AuthorizedOnlyRoute';
import AccountPage from './AccountPage';
import EditProfilePage from './EditProfilePage';
import ChangePasswordPage from './ChangePasswordPage';
import EditAddressPage from './EditAddressPage';
import AddressesPage from './AddressesPage';
import CreateAddressPage from './CreateAddressPage';

const Routes = () => <>
    <Switch>
        <AuthroizedRouteOnly exact path='/account' component={AccountPage} />
        <AuthroizedRouteOnly exact path='/account/edit/profile' component={EditProfilePage} />
        <AuthroizedRouteOnly exact path='/account/edit/password' component={ChangePasswordPage} />
        <AuthroizedRouteOnly exact path='/account/addresses' component={AddressesPage} />
        <AuthroizedRouteOnly exact path='/account/edit/address/:id' component={EditAddressPage} />
        <AuthroizedRouteOnly exact path='/account/create/address' component={CreateAddressPage} />
    </Switch>
</>

export default Routes;