import React from 'react';
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import MainPage from './pages/MainPage';
import MainLayout from './skeleton/MainLayout';
import AuthRoutes from './pages/Auth/Routes';
import UploadImage from './pages/UploadImage';
import SocketComponent from './skeleton/SocketComponent';
import AdminRoutes from './pages/Admin/Routes';
import AccountRoutes from './pages/Account/Routes';
import ErrorPage from './pages/ErrorPage';
import OwnerRoutes from './pages/Owner/Routes';

const App = () => <>
  <MainLayout>
    <SocketComponent />
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route path='/auth' component={AuthRoutes} />
        <Route path='/admin' component={AdminRoutes} />
        <Route path='/account' component={AccountRoutes} />
        <Route path='/owner' component={OwnerRoutes} />
        <Route path='/upload-image' component={UploadImage} />

        <Route path='/error/:code' component={ErrorPage} />
        <Redirect to='/error/404' />
      </Switch>
    </Router>
  </MainLayout>
</>

export default App;