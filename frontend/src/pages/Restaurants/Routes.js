import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RestaurantsPage from './RestaurantsPage';
import RestaurantPage from './RestaurantPage';
import OpinionsPage from './OpinionsPage';

const Routes = () => {
    return <>
        <Switch>
            <Route exact path='/restaurants' component={RestaurantsPage} />
            <Route exact path='/restaurants/:id' component={RestaurantPage} />
            <Route exact path='/restaurants/:id/opinions' component={OpinionsPage} />
        </Switch>
    </>
};

export default Routes;