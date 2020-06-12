import React from 'react';
import { Switch } from 'react-router-dom';
import AuthorizedOnlyRoute from '../../route-types/AuthorizedOnlyRoute';
import RestaurantsPage from './RestaurantsPage';
import CreateRestaurantPage from './CreateRestaurantPage';
import EditRestaurantPage from './EditRestaurantPage';
import EditGalleryPage from './EditGalleryPage';
import EditRestaurantBasicInfoPage from './EditRestaurantBasicInfoPage';
import EditMenuPage from './EditMenuPage';
import CreatePizzaPage from './CreatePizzaPage';
import CreateExtraIngredientPage from './CreateExtraIngredientPage';
import CreateExtraPage from './CreateExtraPage';
import RestaurantOverviewPage from './RestaurantOverviewPage';

const Routes = () => <>
    <Switch>
        <AuthorizedOnlyRoute roles={['OWNER']} exact path='/owner/restaurants'
            component={RestaurantsPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/:id'
            component={RestaurantOverviewPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/create'
            component={CreateRestaurantPage} />

        <AuthorizedOnlyRoute roles={['OWNER']} exact path='/owner/restaurants/:id/edit'
            component={EditRestaurantPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} exact path='/owner/restaurants/:id/edit/basic'
            component={EditRestaurantBasicInfoPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/:id/edit/gallery'
            component={EditGalleryPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/:id/edit/menu'
            component={EditMenuPage} />

        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/:id/create/pizza'
            component={CreatePizzaPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/:id/create/extra-ingredient'
            component={CreateExtraIngredientPage} />
        <AuthorizedOnlyRoute roles={['OWNER']} path='/owner/restaurants/:id/create/extra'
            component={CreateExtraPage} />
    </Switch>
</>

export default Routes;