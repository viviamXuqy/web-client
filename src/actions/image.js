import { CALL_API } from '../middleware/api';
import { GET_IMG } from '../constants/actionTypes';

// server端通用获取图片
export const getImg = (id, scale, quality) => ({ // eslint-disable-line
  [CALL_API]: {
    type: GET_IMG,
    method: 'GET',
    endpoint: `/image/${id}/${scale === undefined ? 10 : scale}/${quality === undefined ? 100 : quality}`,
    suppressLoading: true,
    suppressError: true,
  },
});
