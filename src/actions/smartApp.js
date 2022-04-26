import { CALL_API } from '../middleware/api';
import { Schemas } from '../constants/entities';
import {
  FETCH_VEHICLE_TASKS, FETCH_ACTIVE_TASKS, ADD_VEHICLE_TASK, CLEAR_VEHICLE_TASK,
  DELETE_VEHICLE_TASK, CLOSE_VEHICLE_TASK, GET_VEHICLE_RESULT, DELETE_VEHICLE_RESULT,
  CLEAR_VEHICLE_RESULT, FETCH_VEHICLE_RESULTS, FETCH_MONITOR_PLAYPATH, FETCH_MONITOR_ANALYSIS,
  START_MONITOR, STOP_MONITOR, FETCH_MONITOR_DATA, START_VEHICLE_TASK, FETCH_VIOLATIONS,
  DELETE_VIOLATION_TASKS, CLEAR_VIOLATION_TASKS, SWITCH_VIOLATION_TASKS, ADD_VIOLATION_TASK,
  MODIFY_VIOLATION_TASKS, FETCH_VIOLATION_RESULTS, DELETE_VIOLATION_RESULTS,
  CLEAR_VIOLATION_RESULTS, GET_VIOLATION_RESULT, RESET_MONITOR_DATA,
} from '../constants/actionTypes';

// 获取机动车任务列表
export const fetchVehicleTasks = options => ({
  [CALL_API]: {
    type: FETCH_VEHICLE_TASKS,
    schema: Schemas.VEHICLE_TASK_ARRAY,
    endpoint: '/app/vehicle/task/list',
    options,
  },
});


// 获取进行中的任务列表
export const fetchActiveTask = options => ({
  [CALL_API]: {
    type: FETCH_ACTIVE_TASKS,
    endpoint: '/task/activeTask',
    options,
  },
});

// 清空任务
export const deleteAllTasks = () => ({
  [CALL_API]: {
    type: CLEAR_VEHICLE_TASK,
    method: 'DELETE',
    endpoint: '/app/vehicle/task',
  },
});

// 批量删除任务
export const deleteTasks = ids => ({
  [CALL_API]: {
    type: DELETE_VEHICLE_TASK,
    method: 'DELETE',
    endpoint: `/app/vehicle/task/${ids}`,
  },
});

// 创建机动车任务
export const addVehicleTask = payload => ({
  [CALL_API]: {
    type: ADD_VEHICLE_TASK,
    method: 'POST',
    endpoint: '/app/vehicle/task',
    payload,
  },
});

// 批量关闭任务
export const closeTasks = payload => ({
  [CALL_API]: {
    type: CLOSE_VEHICLE_TASK,
    method: 'POST',
    endpoint: '/app/vehicle/task/close',
    payload,
  },
});

// 获取机动车任务结果详情
export const getResult = id => ({
  [CALL_API]: {
    type: GET_VEHICLE_RESULT,
    method: 'GET',
    endpoint: `/app/vehicle/result/${id}`,
  },
});

// 批量删除结果
export const deleteResults = ids => ({
  [CALL_API]: {
    type: DELETE_VEHICLE_RESULT,
    method: 'DELETE',
    endpoint: `/app/vehicle/result/${ids}`,
  },
});

// 清空结果
export const clearResults = () => ({
  [CALL_API]: {
    type: CLEAR_VEHICLE_RESULT,
    method: 'DELETE',
    endpoint: '/app/vehicle/result',
  },
});

export const fetchVehicleResultsReq = options => ({
  [CALL_API]: {
    type: FETCH_VEHICLE_RESULTS,
    schema: Schemas.VEHICLE_RESULT_ARRAY,
    endpoint: '/app/vehicle/result',
    options: {
      pageSize: 8,
      ...options,
    },
  },
});

// 获取机动车驾驶监控-结果列表,检索结果列表
export const fetchVehicleResults = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...filter.vehicleResults,
    ...options,
  };

  return dispatch(fetchVehicleResultsReq(newOptions));
};

// 开启任务
export const startTasks = payload => ({
  [CALL_API]: {
    type: START_VEHICLE_TASK,
    method: 'POST',
    endpoint: '/app/vehicle/task/start',
    payload,
  },
});

// 获取直播流
export const fetchMonitorPlayPath = id => ({
  [CALL_API]: {
    type: FETCH_MONITOR_PLAYPATH,
    endpoint: `/app/monitor/playPath/${id}`,
  },
});

// 获取流量统计数据
export const fetchMonitorAnalysis = id => ({
  [CALL_API]: {
    type: FETCH_MONITOR_ANALYSIS,
    endpoint: `/app/monitor/analysis/${id}`,
    suppressLoading: true,
  },
});

// 实时交通监控开启
export const startMonitor = payload => ({
  [CALL_API]: {
    type: START_MONITOR,
    method: 'POST',
    endpoint: '/app/monitor/start',
    payload,
  },
});

// 实时交通监控关闭
export const stopMonitor = payload => ({
  [CALL_API]: {
    type: STOP_MONITOR,
    method: 'POST',
    endpoint: '/app/monitor/stop',
    payload,
  },
});

// 获取流量统计数据
export const fetchMonitorData = id => ({
  [CALL_API]: {
    type: FETCH_MONITOR_DATA,
    endpoint: `/app/monitor/data/${id}`,
    suppressLoading: true,
  },
});

/**
 违章监控管理
 * * */

export const fetchViolationsReq = options => ({
  [CALL_API]: {
    type: FETCH_VIOLATIONS,
    schema: Schemas.VIOLATION_TASK_ARRAY,
    endpoint: '/app/violation/list',
    options,
  },
});

// 获取违章任务列表
export const fetchViolationList = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...options,
    ...filter.violationTasks,
  };

  return dispatch(fetchViolationsReq(newOptions));
};

// 批量删除违章任务
export const deleteViolationTasks = ids => ({
  [CALL_API]: {
    type: DELETE_VIOLATION_TASKS,
    method: 'DELETE',
    endpoint: `/app/violation/${ids}`,
  },
});

// 清空任务
export const clearViolationTasks = () => ({
  [CALL_API]: {
    type: CLEAR_VIOLATION_TASKS,
    method: 'DELETE',
    endpoint: '/app/violation/all',
  },
});

// 监控任务开关
export const switchViolationTasks = id => ({
  [CALL_API]: {
    type: SWITCH_VIOLATION_TASKS,
    method: 'PUT',
    endpoint: `/app/violation/switch/${id}`,
  },
});

// 新建违章任务
export const addViolationTask = payload => ({
  [CALL_API]: {
    type: ADD_VIOLATION_TASK,
    method: 'POST',
    endpoint: '/app/violation',
    payload,
  },
});

// 修改任务
export const modifyViolationTasks = id => ({
  [CALL_API]: {
    type: MODIFY_VIOLATION_TASKS,
    method: 'PUT',
    endpoint: `/app/violation/${id}`,
  },
});

// 获取违章结果列表
export const fetchViolationResult = options => ({
  [CALL_API]: {
    type: FETCH_VIOLATION_RESULTS,
    schema: Schemas.VIOLATION_RESULT_ARRAY,
    endpoint: '/app/violation/result/list',
    options,
  },
});

// 批量删除违章结果
export const deleteViolationResults = ids => ({
  [CALL_API]: {
    type: DELETE_VIOLATION_RESULTS,
    method: 'DELETE',
    endpoint: `/app/violation/result/${ids}`,
  },
});

// 清空结果
export const clearViolationResults = () => ({
  [CALL_API]: {
    type: CLEAR_VIOLATION_RESULTS,
    method: 'DELETE',
    endpoint: '/app/violation/result/all',
  },
});

// 违章结果详细信息-城市道路违停
export const getViolationResult = id => ({
  [CALL_API]: {
    type: GET_VIOLATION_RESULT,
    method: 'GET',
    endpoint: `/app/violation/result/${id}`,
  },
});

// 重置数据，包括目标数量，识别结果
export const resetMonitorData = id => ({
  [CALL_API]: {
    type: RESET_MONITOR_DATA,
    endpoint: `/app/monitor/reset/${id}`,
    method: 'DELETE',
  },
});

