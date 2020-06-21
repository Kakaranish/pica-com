import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import HttpsRedirect from 'react-https-redirect';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store';

const { store, persistor } = configureStore();

const isProduction = process.env.NODE_ENV === 'production';

axios.defaults.withCredentials = true;
if (isProduction) axios.defaults.baseURL = 'https://pica-com-backend.azurewebsites.net';
else axios.defaults.baseURL = 'http://localhost:9000';

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HttpsRedirect disabled={!isProduction}>
        <App />
      </HttpsRedirect>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
