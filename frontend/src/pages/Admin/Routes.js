import React from 'react';
import { Switch } from 'react-router-dom';
import AuthroizedRouteOnly from '../../route-types/AuthorizedOnlyRoute';
import UsersPage from './Users/UsersPage';
import EditUserPage from './Users/EditUserPage';
import RestaurantsPage from './Restaurants/RestaurantsPage';
import RestaurantOverviewPage from './Restaurants/RestaurantOverviewPage';
import CategoriesPage from './Categories/CategoriesPage';
import CreateCategoryPage from './Categories/CreateCategoryPage';
import ManagePage from './ManagePage';

const Routes = () => <>
    <Switch>
        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage'
            component={ManagePage} />

        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage/users'
            component={UsersPage} />
        <AuthroizedRouteOnly roles={['ADMIN']} path='/admin/manage/users/:id'
            component={EditUserPage} />

        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage/categories'
            component={CategoriesPage} />
        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage/categories/create'
            component={CreateCategoryPage} />

        <AuthroizedRouteOnly roles={['ADMIN']} exact path='/admin/manage/restaurants'
            component={RestaurantsPage} />
        <AuthroizedRouteOnly roles={['ADMIN']} path='/admin/manage/restaurants/:id'
            component={RestaurantOverviewPage} />
    </Switch>
</>

export default Routes;