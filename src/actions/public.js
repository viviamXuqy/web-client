import { CLEAR_DATAS } from '../constants/actionTypes';

export const clearDatas = (key = '') => ({ // eslint-disable-line
  type: CLEAR_DATAS,
  key,
});
