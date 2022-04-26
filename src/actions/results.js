import { CALL_API } from '../middleware/api';
import { Schemas } from '../constants/entities';
import { FETCH_RESULT, FETCH_RESULTS, SUBMIT_RESULT, DELETE_RESULT, DELETE_RESULT_ALL, UPLOAD_RESULT_FEATURE } from '../constants/actionTypes';

// fetch Result request
export const fetchResult = id => ({
  [CALL_API]: {
    type: FETCH_RESULT,
    endpoint: `/result/${id}`,
  },
});

export const fetchResultsReq = options => ({
  [CALL_API]: {
    type: FETCH_RESULTS,
    schema: Schemas.RESULT_ARRAY,
    endpoint: '/result',
    options: {
      pageSize: 8,
      ...options,
    },
  },
});

export const fetchResults = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...filter.results,
    ...options,
  };
  return dispatch(fetchResultsReq(newOptions));
};

export const submitResult = (id, payload) => ({
  [CALL_API]: {
    type: SUBMIT_RESULT,
    schema: Schemas.RESULT,
    payload,
    method: id ? 'PUT' : 'POST',
    endpoint: `/result${id ? `/${id}` : ''}`,
  },
});

export const deleteResults = (ids = [], taskId) => ({
  [CALL_API]: {
    type: DELETE_RESULT,
    method: 'DELETE',
    endpoint: `/result/${ids.length ? ids.join(',') : 'a'}/${taskId ? `${taskId}` : 'a'}`,
  },
});

export const deleteAllResults = () => ({
  [CALL_API]: {
    type: DELETE_RESULT_ALL,
    method: 'DELETE',
    endpoint: '/result/all',
  },
});

export const uploadResultFeature = formData => ({
  [CALL_API]: {
    type: UPLOAD_RESULT_FEATURE,
    method: 'POST',
    endpoint: '/file/struct',
    formData,
  },
});
