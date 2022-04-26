import { CALL_API } from '../middleware/api';
import { Schemas } from '../constants/entities';
import { FETCH_CAMERAS, FETCH_CAMERA, ADD_CAMERA, DELETE_CAMERA, UPDATE_CAMERA_AREA, UPDATE_CAMERA_REC, UPDATE_CAMERA_RECS, GET_CAMERA_IMG, RENAME_CAMERA, UPLOAD_EXCEL_FILE, GET_CAMERA_TASK_NUM, FETCH_NVRS, ADD_NVR, MODIFY_NVR, DELETE_NVR } from '../constants/actionTypes';

// fetch Camera request
export const fetchCamera = id => ({
  [CALL_API]: {
    type: FETCH_CAMERA,
    endpoint: `/camera/${id}`,
  },
});

// 设备列表请求2
export const fetchCamerasReq = options => ({
  [CALL_API]: {
    type: FETCH_CAMERAS,
    schema: Schemas.CAMERA_ARRAY,
    endpoint: '/camera/page',
    options,
  },
});

// 设备列表请求1
export const fetchCameras = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...options,
    ...filter.cameras,
  };

  return dispatch(fetchCamerasReq(newOptions));
};

// 新增Camera
export const addCamera = payload => ({
  [CALL_API]: {
    type: ADD_CAMERA,
    schema: Schemas.CAMERA,
    method: 'POST',
    endpoint: '/camera',
    payload,
  },
});

// 删除Camera
export const deleteCameras = (ids = []) => ({
  [CALL_API]: {
    type: DELETE_CAMERA,
    method: 'DELETE',
    endpoint: `/camera/${ids.length ? ids.join(',') : ''}`,
  },
});

// 更新Camera的Area
export const updateCameraArea = (id, payload) => ({
  [CALL_API]: {
    type: UPDATE_CAMERA_AREA,
    schema: Schemas.CAMERA,
    method: 'PUT',
    endpoint: `/camera/${id}`,
    payload,
  },
});

// 更新Camera监控开关
export const updateCameraRec = payload => ({
  [CALL_API]: {
    type: UPDATE_CAMERA_REC,
    method: 'POST',
    endpoint: '/camera/state',
    payload,
  },
});

// 更新Cameras监控开关
export const updateCameraRecs = payload => ({
  [CALL_API]: {
    type: UPDATE_CAMERA_RECS,
    method: 'POST',
    endpoint: '/camera/state',
    payload,
  },
});

// 获取Camera的显示图片
export const getCameraImg = (id, quality) => ({
  [CALL_API]: {
    type: GET_CAMERA_IMG,
    method: 'GET',
    endpoint: `/camera/preview/${id}/${quality === undefined ? 100 : quality}`,
  },
});

// 重命名摄像头
export const renameCamera = (id, payload) => ({
  [CALL_API]: {
    type: RENAME_CAMERA,
    method: 'PUT',
    endpoint: `/camera/name/${id}`,
    payload,
  },
});

// 上传批量刷新列表文件
export const uploadFile = formData => ({
  [CALL_API]: {
    type: UPLOAD_EXCEL_FILE,
    method: 'POST',
    endpoint: '/cameraFlush',
    formData,
  },
});

// get camera currentNum/totalNum （摄像头开启/总数） 接口暂定
export const getCameraNum = options => ({ // eslint-disable-line no-unused-vars
  // [CALL_API]: {
  //   type: GET_CAMERA_NUM,
  //   method: 'GET',
  //   endpoint: '/camera/num',
  //   options,
  // },
});

// 获取到摄像头关联的任务
export const getTasknum = id => ({
  [CALL_API]: {
    type: GET_CAMERA_TASK_NUM,
    method: 'GET',
    endpoint: `/camera/tasknum/${id}`,
  },
});

// NVR列表请求2
export const fetchNvrsReq = options => ({
  [CALL_API]: {
    type: FETCH_NVRS,
    schema: Schemas.NVR_ARRAY,
    endpoint: '/nvr',
    options,
  },
});

// NVR列表请求1
export const fetchNvrs = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...options,
    ...filter.nvrs,
  };

  return dispatch(fetchNvrsReq(newOptions));
};

// 新增Nvr
export const addNvr = payload => ({
  [CALL_API]: {
    type: ADD_NVR,
    schema: Schemas.NVR,
    method: 'POST',
    endpoint: '/nvr',
    payload,
  },
});

// 删除Nvr
export const deleteNvrs = (ids = []) => ({
  [CALL_API]: {
    type: DELETE_NVR,
    method: 'DELETE',
    endpoint: `/nvr/${ids.length ? ids.join(',') : ''}`,
  },
});

// 更新Nvr
export const modifyNvr = (id, payload) => ({
  [CALL_API]: {
    type: MODIFY_NVR,
    schema: Schemas.NVR,
    method: 'PUT',
    endpoint: `/nvr/${id}`,
    payload,
  },
});
