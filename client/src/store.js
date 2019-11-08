import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import logger from 'redux-logger';

const inititalState = {};

const store = createStore(
    rootReducer,
    inititalState,
    applyMiddleware(thunk, logger));

export default store;