import React from 'react';
import { Switch } from 'react-router-dom';
import AuthorizedOnlyRoute from '../../route-types/AuthorizedOnlyRoute';
import RestaurantsPage from './RestaurantsPage';
import CreateRestaurantPage from './CreateRestaurantPage';
import EditRestaurantPage from './EditRestaurantPage';
import EditGalleryPage from './EditGalleryPage';

const Routes = () => <>
    <Switch>
        <AuthorizedOnlyRoute roles={['OWNER']} exact path='/owner/restaurants'
            component={RestaurantsPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/create'
            component={CreateRestaurantPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} exact path='/owner/restaurants/:id/edit'
            component={EditRestaurantPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/:id/edit/gallery'
            component={EditGalleryPage} />
    </Switch>
</>

export default Routes;