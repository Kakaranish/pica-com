import { combineReducers } from 'redux';
import identityReducer from './profileReducer/reducer';

const rootReducer = combineReducers({
    identity: identityReducer
});

export default rootReducer;