import { SHOW_ERROR_MESSAGE, HIDE_ERROR_MESSAGE } from '../constants/actionTypes';

export const showErrorMessage = (errorMsg = '') => ({
  type: SHOW_ERROR_MESSAGE,
  errorMsg,
});

export const hideErrorMessage = () => ({
  type: HIDE_ERROR_MESSAGE,
});
