import { CALL_API } from '../middleware/api';
import { Schemas } from '../constants/entities';
import {
  GET_REVIEW_PLATE_TASK, GET_REVIEW_PLATE_TASKS, GET_REVIEW_PLATE_PREVIEW_IMAGE,
  PUT_REVIEW_PLATE_AREA, PUT_REVIEW_PLATE_TASK_START, GET_REVIEW_PLATE_RESULTS,
  GET_REVIEW_PLATE_TASK_STATISTICS,
} from '../constants/actionTypes';

export const getReviewPlateTask = id => ({
  [CALL_API]: {
    type: GET_REVIEW_PLATE_TASK,
    schema: Schemas.REVIEW_PLATE_TASK,
    endpoint: `/review/video/${id}`,
  },
});

export const getReviewPlateTaskStatistics = id => ({
  [CALL_API]: {
    type: GET_REVIEW_PLATE_TASK_STATISTICS,
    endpoint: `/review/video/plate/overview/${id}`,
  },
});

// 获取复省车牌任务列表2
export const getReviewPlateTasks2 = options => ({
  [CALL_API]: {
    type: GET_REVIEW_PLATE_TASKS,
    schema: Schemas.REVIEW_PLATE_TASK_ARRAY,
    endpoint: '/review/video',
    options,
    suppressLoading: options.suppressLoading ? options.suppressLoading : false,
  },
});

// 获取复省车牌任务列表1
export const getReviewPlateTasks = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...options,
    ...filter.reviewPlateTasks,
  };

  return dispatch(getReviewPlateTasks2(newOptions));
};


// 获取预览图片
export const getReviewPlatePreviewImage = (id, quality) => ({
  [CALL_API]: {
    type: GET_REVIEW_PLATE_PREVIEW_IMAGE,
    endpoint: `/review/video/image/${id}/${quality === undefined ? 100 : quality}`,
  },
});

// 更新Area
export const putReviewPlateArea = (id, payload) => ({
  [CALL_API]: {
    type: PUT_REVIEW_PLATE_AREA,
    schema: Schemas.REVIEW_PLATE_TASK,
    method: 'PUT',
    endpoint: `/review/video/setting/${id}`,
    payload,
  },
});

// 任务开关 status 0关闭/1开启/2暂停
export const putReviewPlateTaskStart = (id, payload) => ({
  [CALL_API]: {
    type: PUT_REVIEW_PLATE_TASK_START,
    schema: Schemas.REVIEW_PLATE_TASK,
    payload,
    method: 'PUT',
    endpoint: `/review/video/start/${id}`,
  },
});

// 获取复审车牌识别结果2
export const getReviewPlateResults2 = options => ({
  [CALL_API]: {
    type: GET_REVIEW_PLATE_RESULTS,
    schema: Schemas.REVIEW_PLATE_RESULT_ARRAY,
    endpoint: '/review/video/plate/result',
    options,
  },
});

// 获取复审车牌识别结果1
export const getReviewPlateResults = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...filter.reviewPlateResults,
    ...options,
  };

  return dispatch(getReviewPlateResults2(newOptions));
};

