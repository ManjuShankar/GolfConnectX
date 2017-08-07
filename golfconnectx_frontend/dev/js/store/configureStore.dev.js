import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';
import createLogger from 'redux-logger';

import rootReducer from '../reducers';

export default function configureStore() {
  const logger = createLogger();
    const store = createStore(
        rootReducer,
        applyMiddleware(thunk, promise, logger)
    );

    return store;
}
