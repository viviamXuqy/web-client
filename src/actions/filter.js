import { UPDATE_FILTER } from '../constants/actionTypes';

export const updateFilter = (key = '', payload = {}) => ({ // eslint-disable-line
  type: UPDATE_FILTER,
  key,
  payload,
});
