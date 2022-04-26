import reducer from 'reducers';

import {
  FETCH_USER,
  UPDATE_USER,
  UPDATE_FILTER,
  CLEAR_DATAS,
} from 'constants/actionTypes';

import configureStore from '../../store/__tests__/configureStore.test';

const { state } = configureStore;

describe('reducers test cases', () => {
  it('should handle FETCH_USER_SUCCESS right', () => {
    const action = {
      type: `${FETCH_USER}_SUCCESS`,
      response: state.user,
    };
    const { user } = reducer(state, action);
    expect(user).toEqual(state.user);
  });

  it('should handle UPDATE_USER right', () => {
    const data = {
      id: 2,
      username: 'test',
    };
    const action = {
      type: UPDATE_USER,
      payload: data,
    };
    const { user } = reducer(state, action);
    expect(user).toEqual(data);
  });

  it('should handle UPDATE_FILTER with a specific key', () => {
    const data = {
      search: '关键字',
    };
    const action = {
      type: UPDATE_FILTER,
      payload: data,
      key: 'results',
    };
    const { filter } = reducer(state, action);
    expect(filter).toEqual({
      ...state.filter,
      [action.key]: data,
    });
  });

  it('should handle UPDATE_FILTER with a `all` key', () => {
    const preState = {
      filter: {
        users: {
          a: '1',
          b: '2',
        },
        results: {
          c: '3',
          d: '4',
        },
      },
    };
    const data = {
      search: '关键字',
      beginTime: 1529355966000,
      endTime: 1529355966123,
    };
    const action = {
      type: UPDATE_FILTER,
      payload: data,
      key: 'all',
    };
    const { filter } = reducer(preState, action);
    expect(filter).toEqual({
      users: data,
      results: data,
    });
  });

  it("should handle filter update toBe '{}' when CLEAR_DATAS", () => {
    const preState = {
      filter: {
        results: {
          c: '3',
          d: '4',
        },
      },
    };

    const action = {
      type: CLEAR_DATAS,
      key: 'results',
    };
    const { filter } = reducer(preState, action);
    expect(filter).toEqual({
      ...preState.filter,
      [action.key]: {},
    });
  });

  it('should handle meta update when FETCH_REDUCER_NAME_SUCCESS', () => {
    const preState = {
      meta: {
        reducerName: {
          page: 1,
          pageSize: 10,
        },
      },
    };
    const data = {
      page: 2,
      pageSize: 10,
    };
    const action = {
      type: 'FETCH_REDUCER_NAME_SUCCESS',
      meta: data,
      key: 'reducerName',
    };
    const { meta } = reducer(preState, action);
    expect(meta).toEqual({
      reducerName: data,
    });
  });

  it("should handle meta update toBe '{}' when CLEAR_DATAS", () => {
    const preState = {
      meta: {
        results: {
          page: 1,
          pageSize: 10,
        },
      },
    };
    const action = {
      type: CLEAR_DATAS,
      key: 'results',
    };
    const { meta } = reducer(preState, action);
    expect(meta).toEqual({
      ...preState.meta,
      [action.key]: {},
    });
  });

  it('should handle entities added when response result is new', () => {
    const preState = {
      entities: {
        users: {
          1: {
            id: '1',
            username: 'test1',
          },
        },
        usersIds: ['1'],
      },
    };
    const resultUserId = '2';
    const data = {
      [resultUserId]: {
        id: resultUserId,
        username: 'test2',
      },
    };
    const action = {
      type: 'SUBMIT_USER',
      response: {
        key: 'users',
        result: resultUserId,
        entities: {
          users: data,
        },
      },
    };
    const { entities: { users, usersIds } } = reducer(preState, action);
    expect(usersIds).toEqual([resultUserId, ...preState.entities.usersIds]);
    expect(users).toEqual({
      ...preState.entities.users,
      ...data,
    });
  });

  it('should handle entities replaced when response reslult already exits', () => {
    const resultUserId = '1';
    const preState = {
      entities: {
        users: {
          [resultUserId]: {
            id: resultUserId,
            username: 'test1',
          },
        },
        usersIds: [resultUserId],
      },
    };
    const data = {
      [resultUserId]: {
        id: resultUserId,
        username: 'test2',
      },
    };
    const action = {
      type: 'SUBMIT_USER',
      response: {
        key: 'users',
        result: resultUserId,
        entities: {
          users: data,
        },
      },
    };
    const { entities: { users, usersIds } } = reducer(preState, action);

    expect(usersIds).toEqual([...preState.entities.usersIds]);
    expect(users).toEqual({
      ...preState.entities.users,
      ...data,
    });
  });

  it("should handle entities update toBe '{}' when CLEAR_DATAS", () => {
    const resultUserId = '1';
    const preState = {
      entities: {
        users: {
          [resultUserId]: {
            id: resultUserId,
            username: 'test1',
          },
        },
        usersIds: [resultUserId],
      },
    };
    const action = {
      type: CLEAR_DATAS,
      key: 'users',
    };
    const { entities: { users, usersIds } } = reducer(preState, action);

    expect(usersIds).toEqual([]);
    expect(users).toEqual({});
  });

  it('should handle SHOW_ERROR_MESSAGE right', () => {
    const preState = {
      system: {
        error: '',
      },
    };
    const data = '网络超时';
    const action = {
      type: 'SHOW_ERROR_MESSAGE',
      errorMsg: data,
    };
    const { system: { error } } = reducer(preState, action);
    expect(error).toEqual(data);
  });

  it('should handle HIDE_ERROR_MESSAGE right', () => {
    const preState = {
      system: {
        error: '网络超时',
      },
    };
    const action = {
      type: 'HIDE_ERROR_MESSAGE',
    };
    const { system: { error } } = reducer(preState, action);
    expect(error).toBe('');
  });

  it('should handle isLoading', () => {
    const preState = {
      system: {
        isLoading: false,
      },
    };
    const action = {
      type: 'FETCH_USER',
      isLoading: true,
    };
    const { system: { isLoading } } = reducer(preState, action);
    expect(isLoading).toBe(true);
  });

  it('should handle SHOW_LOADING right', () => {
    const preState = {
      system: {
        isLoading: false,
        loadingTip: 'Loading...',
      },
    };
    const data = '加载中...';
    const action = {
      type: 'SHOW_LOADING',
      isLoading: true,
      loadingTip: data,
    };
    const { system: { isLoading, loadingTip } } = reducer(preState, action);
    expect(isLoading).toBeTruthy();
    expect(loadingTip).toBe(data);
  });

  it('should handle HIDE_LOADING right', () => {
    const preState = {
      system: {
        isLoading: true,
        loadingTip: '加载中',
      },
    };
    const data = 'Loading...';
    const action = {
      type: 'HIDE_LOADING',
      isLoading: false,
      loadingTip: data,
    };
    const { system: { isLoading, loadingTip } } = reducer(preState, action);
    expect(isLoading).toBeFalsy();
    expect(loadingTip).toBe(data);
  });
});
