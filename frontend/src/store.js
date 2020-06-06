import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistStore, persistReducer } from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import rootReducer from './common/reducers/rootReducer';

/*
    This has nothing to do with business logic.
    Purpose of this variable is to protect user from himself...
*/
const persistSecret = 'vsGGSDdYgHuCm6hPtZuW6bdBc7TxSHGuRkruJVB7zkh4DpZe8pFhnAm4dZJc5Nny'

const encryptor = createEncryptor({ secretKey: persistSecret });
const persistConfig = { key: 'root', storage, debug: true, transforms: [encryptor] };
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(thunk)));

export default () => {
    let persistor = persistStore(store);
    return { store, persistor }
}