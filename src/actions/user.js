import { replace } from 'react-router-redux';
import Cookies from 'js-cookie';

import { CALL_API } from '../middleware/api';
import { FETCH_USER, SIGNIN, UPDATE_USER } from '../constants/actionTypes';

// fetch user request
export const fetchUser = () => ({
  [CALL_API]: {
    type: FETCH_USER,
    endpoint: '/auth/info',
    method: 'GET',
  },
});

// sign in request
export const signInReq = payload => ({
  [CALL_API]: {
    type: SIGNIN,
    endpoint: '/auth/login',
    method: 'POST',
    payload,
  },
});

export const signIn = payload => dispatch =>
  dispatch(signInReq(payload))
    .then(({ response }) => {
      if (response && response.token) {
        const { token } = response;
        const expireDays = payload.remember ? 365 : 1;

        Cookies.set('token', token, { expires: expireDays });
        dispatch(fetchUser()).then(result => {
          if (result.response) {
            Cookies.set('user', JSON.stringify(result.response), { expires: expireDays });
            dispatch(replace('/'));
          }
        });
      }
    });

export const updateUser = (payload = {}) => ({
  type: UPDATE_USER,
  payload,
});

