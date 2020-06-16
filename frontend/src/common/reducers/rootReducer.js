import { combineReducers } from 'redux';
import identityReducer from './profileReducer/reducer';
import notifReducer from './notifReducer/reducer';
import cartsReducer from './cartReducer/reducer';

const rootReducer = combineReducers({
    identity: identityReducer,
    notifs: notifReducer,
    carts: cartsReducer
});

export default rootReducer;