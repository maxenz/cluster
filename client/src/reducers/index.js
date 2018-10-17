import {combineReducers} from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import printersReducer from './printersReducer';
import requestsReducer from "./requestsReducer";

export default combineReducers({
  errors: errorReducer,
  auth: authReducer,
  printers: printersReducer,
  requests: requestsReducer,
});