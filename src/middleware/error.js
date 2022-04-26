import { replace } from 'react-router-redux';

import { showErrorMessage } from '../actions/errorMessage';

export default store => next => action => {
  const {
    suppressError, error, status,
  } = action;
  const { router = {} } = store.getState();
  const { pathname } = (router && router.location) || {};
  const isNotLogin = [401, 403, 5001].indexOf(status) > -1;

  if (isNotLogin) {
    if (pathname !== '/logout' && pathname !== '/login') {
      store.dispatch(showErrorMessage('App.error.NotLogin'));
      store.dispatch(replace('/logout'));
    }
  } else {
    const isError = [
      49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 80, 500, 504,
    ].indexOf(status) > -1;
    if (isError && !suppressError) {
      store.dispatch(showErrorMessage(`App.error.${status}`));
    } else if (error && !suppressError) {
      store.dispatch(showErrorMessage(error));
    }
    if ([50, 62, 63, 64].indexOf(status) > -1) {
      if (pathname !== '/logout' && pathname !== '/login') {
        store.dispatch(replace('/logout'));
      }
    }
  }

  return next(action);
};
