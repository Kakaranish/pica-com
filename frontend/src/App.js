import React from 'react';
import { Switch, BrowserRouter as Router, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';
import MainPage from './pages/MainPage';
import NotFoundPage from './pages/NotFoundPage';

const App = () => <>
  <Router>
    <Switch>
      <Route exact path='/' component={MainPage} />

      <Route component={NotFoundPage} />
    </Switch>
  </Router>
</>

export default App;