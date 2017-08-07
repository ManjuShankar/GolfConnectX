import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import rootReducer from '../reducers';

export default function configureStore() {
    const store = createStore(
        rootReducer,
        applyMiddleware(thunk, promise)
    );

    return store;
}
