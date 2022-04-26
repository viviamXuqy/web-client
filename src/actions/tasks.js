import { CALL_API } from '../middleware/api';
import { Schemas } from '../constants/entities';
import { FETCH_TASKS, DELETE_TASK, SUBMIT_TASK, UPDATE_TASK_STATUS, UPDATE_TASK_STATUS_LOT, SET_TASK, DELETE_TASK_ALL, FETCH_TASKRESULTS, DELETE_TASKRESULTS, GET_TASK_NUM, FETCH_ACTIVE_TASKS, FETCH_CAMERA_TASKS } from '../constants/actionTypes';

// 任务列表请求2
export const fetchTasksReq = options => ({
  [CALL_API]: {
    type: FETCH_TASKS,
    schema: Schemas.TASK_ARRAY,
    endpoint: '/task',
    options,
    suppressLoading: options.suppressLoading ? options.suppressLoading : false,
  },
});

// 任务列表请求1
export const fetchTasks = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...options,
    ...filter.tasks,
  };

  return dispatch(fetchTasksReq(newOptions));
};

// 删除task 0/默认不删除文件 >=1/删除文件 ,本地默认删除
export const deleteTasks = (ids = [], types = [], deleteFile) => ({
  [CALL_API]: {
    type: DELETE_TASK,
    method: 'DELETE',
    endpoint: `/task/${ids.length ? ids.join(',') : ''}${types.length ? (`/${types.join(',')}`) : ''}/${deleteFile === undefined ? 0 : deleteFile}`,
  },
});

// 新增Task
export const submitTask = payload => ({
  [CALL_API]: {
    type: SUBMIT_TASK,
    method: 'POST',
    endpoint: '/task/multi',
    payload,
  },
});

// 任务开关 status 0关闭/1开启/2暂停
export const updateStatusTask = (id, payload) => ({
  [CALL_API]: {
    type: UPDATE_TASK_STATUS,
    schema: Schemas.TASK,
    payload,
    method: 'PUT',
    endpoint: `/task/setStatus/${id}`,
  },
});

// 任务批量开关 status 0关闭/1开启/2暂停
export const updateStatusLotTask = payload => ({
  [CALL_API]: {
    type: UPDATE_TASK_STATUS_LOT,
    payload,
    method: 'PUT',
    endpoint: '/task/setStatus',
  },
});

// 清空任务
export const deleteAllTasks = type => ({
  [CALL_API]: {
    type: DELETE_TASK_ALL,
    method: 'DELETE',
    endpoint: `/task/all/${type}`,
  },
});

// 任务设置
export const setTask = (id, payload) => ({
  [CALL_API]: {
    type: SET_TASK,
    schema: Schemas.TASK,
    payload,
    method: 'PUT',
    endpoint: `/task/set/${id}`,
  },
});

export const fetchTaskResultsReq = options => ({
  [CALL_API]: {
    type: FETCH_TASKRESULTS,
    schema: Schemas.TASKRESULT_ARRAY,
    endpoint: '/task/result',
    options: {
      pageSize: 8,
      ...options,
    },
  },
});

export const fetchTaskResults = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...filter.taskresults,
    ...options,
  };

  return dispatch(fetchTaskResultsReq(newOptions));
};

export const deleteTaskResults = (ids = []) => ({
  [CALL_API]: {
    type: DELETE_TASKRESULTS,
    method: 'DELETE',
    endpoint: `/task/result/${ids.length ? ids.join(',') : ''}`,
  },
});

// get task currentNum/totalNum （实时）
export const getTaskNum = options => ({
  [CALL_API]: {
    type: GET_TASK_NUM,
    method: 'GET',
    endpoint: '/task/num',
    options,
  },
});

// 获取进行中的任务列表
export const fetchActiveTask = () => ({
  [CALL_API]: {
    type: FETCH_ACTIVE_TASKS,
    endpoint: '/task/activeTask',
  },
});

// 获取结果中已有摄像头名称列表
export const fetchCameraTask = () => ({
  [CALL_API]: {
    type: FETCH_CAMERA_TASKS,
    endpoint: '/task/camera/names',
    method: 'GET',
  },
});
