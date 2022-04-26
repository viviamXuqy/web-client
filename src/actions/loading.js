import { SHOW_LOADING, HIDE_LOADING } from '../constants/actionTypes';

export const hideLoading = () => ({
  type: HIDE_LOADING,
});

export const showLoadingAction = (loadingTip = 'Loading...') => ({
  type: SHOW_LOADING,
  loadingTip,
});

export const showLoading = (loadingTip = 'Loading...', duration) => dispatch => {
  if (duration) {
    setTimeout(() => dispatch(hideLoading()), duration);
  }
  return dispatch(showLoadingAction(loadingTip));
};
