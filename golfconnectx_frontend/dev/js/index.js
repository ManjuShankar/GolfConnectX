import 'babel-polyfill';
import React from 'react';	
import {render} from "react-dom";
import {Provider} from 'react-redux';
import { Router, browserHistory } from 'react-router';
import routes from './config/routes';
import configureStore from './store/index';

import {APP_CONSTANT} from './constants/application.constants'

const store = configureStore();

render(
    <Provider store={store}>
      <Router history={browserHistory} routes={routes}></Router>
    </Provider>,
    document.getElementById(APP_CONSTANT.APP)
);
