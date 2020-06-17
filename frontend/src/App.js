import React from 'react';
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import MainPage from './pages/MainPage';
import MainLayout from './skeleton/MainLayout';
import AuthRoutes from './pages/Auth/Routes';
import NotificationHandler from './skeleton/NotificationHandler';
import UserRoutes from './pages/User/Routes';
import AdminRoutes from './pages/Admin/Routes';
import AccountRoutes from './pages/Account/Routes';
import ErrorPage from './pages/ErrorPage';
import OwnerRoutes from './pages/Owner/Routes';
import RefreshPage from './pages/RefreshPage';
import RestaurantPage from './pages/RestaurantPage';

const App = () => <>
  <MainLayout>
    <NotificationHandler />
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route path='/auth' component={AuthRoutes} />
        <Route path='/user' component={UserRoutes} />
        <Route path='/admin' component={AdminRoutes} />
        <Route path='/account' component={AccountRoutes} />
        <Route path='/owner' component={OwnerRoutes} />

        {/* temp here */}
        <Route path='/restaurants/:id' component={RestaurantPage} />

        <Route path='/error/:code' component={ErrorPage} />
        <Route path='/refresh' component={RefreshPage} />
        <Redirect to='/error/404' />
      </Switch>
    </Router>
  </MainLayout>
</>

export default App;