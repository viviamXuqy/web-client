import { CALL_API } from '../middleware/api';
import { FETCH_FEATURES } from '../constants/actionTypes';

// 结构化数据请求
export const fetchFeatures = options => ({ // eslint-disable-line
  [CALL_API]: {
    type: FETCH_FEATURES,
    endpoint: '/feature',
    options,
  },
});
