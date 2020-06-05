import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './skeleton/MainLayout';
import AuthRoutes from './pages/Auth/Routes';
import UploadImage from './pages/UploadImage';
import AuthorizedOnlyRoute from './route-types/AuthorizedOnlyRoute';
import TestAuthorizedPage from './TestAuthorizedPage';
import SocketComponent from './skeleton/SocketComponent';

const App = () => <>
  <MainLayout>
    <SocketComponent />
    <Router>
      <Switch>
        <Route exact path='/' component={MainPage} />
        <Route path='/auth' component={AuthRoutes} />
        <Route path='/upload-image' component={UploadImage} />
        <AuthorizedOnlyRoute path='/authorized' component={TestAuthorizedPage} roles={['USER', 'ADMIN']} />

        <Route component={NotFoundPage} />
      </Switch>
    </Router>
  </MainLayout>
</>

export default App;