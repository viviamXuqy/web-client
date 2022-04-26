import { CALL_API } from '../middleware/api';
import { Schemas } from '../constants/entities';
import {
  FETCH_SDKS, ADD_SDK, DELETE_SDK, UPDATE_SDK_STATUS, MODIFY_SDK, MODIFY_WORK_MODE, RECOVER_CONFIG,
  SAVE_NTP, SAVE_MANUAL, FETCH_LOGS, DELETE_LOG,
  FETCH_USERS, ADD_USER, DELETE_USER, UPDATE_USER_STATUS, MODIFY_USER,
} from '../constants/actionTypes';

// sdk传输协议列表
export const fetchSdks = options => ({
  [CALL_API]: {
    type: FETCH_SDKS,
    schema: Schemas.SDK_ARRAY,
    endpoint: '/system/event',
    options,
  },
});

// 新增协议
export const addSdk = payload => ({
  [CALL_API]: {
    type: ADD_SDK,
    schema: Schemas.SDK,
    method: 'POST',
    endpoint: '/system/event',
    payload,
  },
});

// 删除协议
export const deleteSdk = id => ({
  [CALL_API]: {
    type: DELETE_SDK,
    method: 'DELETE',
    endpoint: `/system/event/${id}`,
  },
});

// 更新开关
export const updateSdkStatus = (id, payload) => ({
  [CALL_API]: {
    type: UPDATE_SDK_STATUS,
    method: 'PUT',
    endpoint: `/system/event/switch/${id}`,
    schema: Schemas.SDK,
    payload,
  },
});

// 修改协议
export const modifySdk = (id, payload) => ({
  [CALL_API]: {
    type: MODIFY_SDK,
    schema: Schemas.SDK,
    method: 'PUT',
    endpoint: `/system/event/${id}`,
    payload,
  },
});

// 修改工作配置
export const modifyWorkMode = payload => ({
  [CALL_API]: {
    type: MODIFY_WORK_MODE,
    method: 'PUT',
    endpoint: '/system/mode',
    payload,
  },
});

// 恢复系统配置
export const recoverConfig = payload => ({
  [CALL_API]: {
    type: RECOVER_CONFIG,
    method: 'PUT',
    endpoint: '/system/config',
    payload,
  },
});

// 保存Ntp校时
export const saveNtp = payload => ({
  [CALL_API]: {
    type: SAVE_NTP,
    method: 'POST',
    endpoint: '/system/time/ntp',
    payload,
  },
});

// 保存Ntp校时
export const saveManual = payload => ({
  [CALL_API]: {
    type: SAVE_MANUAL,
    method: 'POST',
    endpoint: '/system/time/manual',
    payload,
  },
});

// 日志列表

export const fetchLogsReq = options => ({
  [CALL_API]: {
    type: FETCH_LOGS,
    schema: Schemas.LOG_ARRAY,
    endpoint: '/system/log',
    options,
  },
});

export const fetchLogs = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...options,
    ...filter.logs,
  };

  return dispatch(fetchLogsReq(newOptions));
};

// 删除日志
export const deleteLogs = (ids = []) => ({
  [CALL_API]: {
    type: DELETE_LOG,
    method: 'DELETE',
    endpoint: `/system/log/${ids.length ? ids.join(',') : ''}`,
  },
});

// 用户列表
export const fetchUsers = options => ({
  [CALL_API]: {
    type: FETCH_USERS,
    schema: Schemas.USER_ARRAY,
    endpoint: '/system/user',
    options,
  },
});

// 新增用户
export const addUser = payload => ({
  [CALL_API]: {
    type: ADD_USER,
    schema: Schemas.USER,
    method: 'POST',
    endpoint: '/system/user',
    payload,
  },
});

// 删除用户
export const deleteUser = id => ({
  [CALL_API]: {
    type: DELETE_USER,
    method: 'DELETE',
    endpoint: `/system/user/${id}`,
  },
});

// 更新用户开关
export const updateUserStatus = (id, payload) => ({
  [CALL_API]: {
    type: UPDATE_USER_STATUS,
    method: 'PUT',
    endpoint: `/system/user/switch/${id}`,
    schema: Schemas.USER,
    payload,
  },
});

// 修改用户
export const modifyUser = (id, payload) => ({
  [CALL_API]: {
    type: MODIFY_USER,
    schema: Schemas.USER,
    method: 'PUT',
    endpoint: `/system/user/${id}`,
    payload,
  },
});
