import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import Cookies from 'js-cookie';

import { toQueryString } from '../utils';
import { API_URL } from '../constants/config';

const TIME_OUT = 25 * 1000;
let callsNum = 0;
const defaultHTTPHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

function _fetch(url, config) {
  return Promise.race([
    fetch(url, config),
    new Promise(((resolve, reject) => {
      setTimeout(() => reject({ status: 504 }), TIME_OUT); // eslint-disable-line
    }))]);
}

// Fetches an API response.
// This makes every API response have the same shape, regardless of how nested it was.
const callApi = async ({
  endpoint, method, payload, options = {}, formData,
}, schema) => {
  const token = Cookies.get('token');
  const query = toQueryString(options);
  const url = `${API_URL}${endpoint}${query ? '?' : ''}${query}`;
  let config = {
    method: method || 'GET',
    body: formData || JSON.stringify(payload),
  };
  if (formData) {
    config = {
      headers: { ...token ? { token } : {} },
      ...config,
    };
  } else {
    config = {
      headers: {
        ...defaultHTTPHeaders,
        ...token ? { token } : {},
      },
      ...config,
    };
  }

  if (config.method === 'GET' || config.method === 'DELETE') {
    delete config.body;
  }

  const response = await _fetch(url, config);
  const json = await response.json();
  const isError = json.code !== 200;
  const status = json.code || response.status;

  if (isError) {
    return Promise.reject({ // eslint-disable-line
      ...json,
      status,
    });
  }

  const { result } = json;
  let meta = {};
  let camelizedJson = null;
  if (result) {
    const {
      data, page, pageSize, total,
    } = result;
    meta = {
      current: page,
      pageSize,
      total,
    };
    camelizedJson = camelizeKeys(data || result);
  }
  if (result === 0) {
    camelizedJson = camelizeKeys(result);
  }
  // if (!camelizedJson) camelizedJson = camelizeKeys(json);
  Object.keys(meta).forEach(k => {
    if (meta[k] === undefined) {
      delete meta[k];
    }
  });

  return (schema && result) ? {
    key: Array.isArray(schema) ? schema[0]._key : schema._key,
    meta,
    data: {
      key: Array.isArray(schema) ? schema[0]._key : schema._key,
      ...normalize(camelizedJson, schema),
    },
    status,
  } : {
    key: '',
    meta,
    data: camelizedJson,
    status,
  };
};

// Action key that carries API call info interpreted by this Redux middleware.
export const CALL_API = 'Call API';

// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => action => {
  const callAPI = action[CALL_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let { endpoint } = callAPI;
  const {
    schema, type, suppressError, suppressLoading,
  } = callAPI;
  const types = [
    type,
    `${type}_SUCCESS`,
    `${type}_FAILURE`,
  ];

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.');
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.');
  }
  if (!types.every(t => typeof t === 'string')) {
    throw new Error('Expected action types to be strings.');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_API];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;

  if (!suppressLoading) {
    callsNum += 1;
  }
  next(actionWith({ type: requestType, isLoading: callsNum > 0 }));

  return callApi(callAPI, schema).then(
    response => {
      if (!suppressLoading) {
        callsNum -= 1;
      }

      return next(actionWith({
        isOk: true,
        key: response.key,
        response: response.data,
        meta: response.meta,
        type: successType,
        status: response.status,
        isLoading: callsNum > 0,
      }));
    },
    error => {
      if (!suppressLoading) {
        callsNum -= 1;
      }

      return next(actionWith({
        isOk: false,
        suppressError,
        type: failureType,
        error: error.message || error.result || 'Something bad happened',
        status: error.status,
        isLoading: callsNum > 0,
      }));
    },
  );
};
