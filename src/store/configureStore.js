import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import api from '../middleware/api';
import error from '../middleware/error';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const isDev = process.env.NODE_ENV === 'development';
const loggerMiddleware = isDev ? [createLogger()] : [];

const configureStore = history => {
  const store = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(
      routerMiddleware(history),
      thunk, api, error, ...loggerMiddleware,
    )),
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers').default // eslint-disable-line
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
