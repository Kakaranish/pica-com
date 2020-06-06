import { combineReducers } from 'redux';
import identityReducer from './profileReducer/reducer';
import notifReducer from './notifReducer/reducer';

const rootReducer = combineReducers({
    identity: identityReducer,
    notifs: notifReducer
});

export default rootReducer;