import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { FETCH_USER, UPDATE_USER, UPDATE_FILTER, CLEAR_DATAS, SHOW_ERROR_MESSAGE, HIDE_ERROR_MESSAGE, SHOW_LOADING, HIDE_LOADING } from '../constants/actionTypes';

const user = (state = {}, {
  type,
  response,
  payload,
}) => {
  switch (type) {
    case `${FETCH_USER}_SUCCESS`:
      return {
        ...response,
      };
    case UPDATE_USER:
      return payload;
    default:
      return state;
  }
};

const filter = (
  state = {
    results: {},
    cameras: {},
    bayonets: {},
    tasks: {},
    taskresults: {},
    logs: {},
    nvrs: {},
    vehicleResults: {},
    violationTasks: {},
    violationResults: {},
    reviewPlateTasks: {},
    reviewPlateResults: {},
  },
  {
    type,
    key,
    payload,
  },
) => {
  switch (type) {
    case UPDATE_FILTER:
      return key === 'all' ?
        Object.keys(state).reduce((obj, k) => ({
          ...obj,
          [k]: {
            ...payload,
          },
        }), {})
        : {
          ...state,
          [key]: {
            ...payload,
          },
        };
    case CLEAR_DATAS:
      return {
        ...state,
        [key]: {},
      };
    default:
      return state;
  }
};

const meta = (state = {
  results: {},
  cameras: {},
  bayonets: {},
  tasks: {},
  taskresults: {},
  sdks: {},
  logs: {},
  nvrs: {},
  users: {},
  vehicleResults: {},
  vehicleTasks: {},
  activeTasks: {},
  violationTasks: {},
  violationResults: {},
  reviewPlateTasks: {},
  reviewPlateResults: {},
}, action) => {
  const { type, meta: actionMeta, key } = action;
  if (type === CLEAR_DATAS) {
    return {
      ...state,
      [key]: {},
    };
  }
  if (actionMeta && Object.keys(actionMeta).length > 0 && key) {
    return {
      ...state,
      [key]: {
        ...actionMeta,
      },
    };
  }

  return state;
};

// Updates an entity cache in response to any action with response.entities.
const entities = (state = {
  results: {},
  resultsIds: [],
  cameras: {},
  camerasIds: [],
  bayonets: {},
  bayonetsIds: [],
  tasks: {},
  tasksIds: [],
  taskresults: {},
  taskresultsIds: [],
  sdks: {},
  sdksIds: [],
  logs: {},
  logsIds: [],
  nvrs: {},
  nvrsIds: [],
  users: {},
  usersIds: [],
  vehicleTasks: {},
  vehicleTasksIds: [],
  vehicleResults: {},
  vehicleResultsIds: [],
  violationTasks: {},
  violationTasksIds: [],
  violationResults: {},
  violationResultsIds: [],
  reviewPlateTasks: {},
  reviewPlateTasksIds: [],
  reviewPlateResults: {},
  reviewPlateResultsIds: [],
}, action) => {
  const { type, key: actionKey } = action;
  if (type === CLEAR_DATAS) {
    return {
      ...state,
      [actionKey]: {},
      [`${actionKey}Ids`]: [],
    };
  }
  if (action.response && action.response.entities) {
    const { result, key } = action.response;
    let data = {
      ...action.response.entities[key],
    };
    let ids = [...state[`${key}Ids`]];

    if (Array.isArray(result)) {
      ids = [...result];
    }

    if (typeof result === 'string') {
      if (ids.indexOf(result) < 0) {
        // add new
        ids = [result, ...state[`${key}Ids`]];
      }

      data = {
        ...state[key],
        ...action.response.entities[key],
      };
    }
    ids.filter(idsTemp => idsTemp);

    return {
      ...state,
      [key]: data,
      [`${key}Ids`]: ids,
    };
  }

  return state;
};

const system = (
  state = {
    isLoading: false,
    loadingTip: 'Loading...',
    error: '',
  },
  action,
) => {
  const { isLoading, loadingTip, errorMsg: error } = action;

  switch (action.type) {
    case SHOW_ERROR_MESSAGE:
      return {
        ...state,
        error,
      };

    case HIDE_ERROR_MESSAGE:
      return {
        ...state,
        error: '',
      };

    case SHOW_LOADING:
      return {
        ...state,
        isLoading: true,
        loadingTip,
      };

    case HIDE_LOADING:
      return {
        ...state,
        isLoading: false,
        loadingTip: 'Loading...',
      };

    default:
      return {
        ...state,
        ...isLoading !== undefined && { isLoading },
      };
  }
};

const rootReducer = combineReducers({
  user,
  filter,
  meta,
  entities,
  system,
  router: routerReducer,
});

export default rootReducer;
