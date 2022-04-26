import { CALL_API } from '../middleware/api';
import { Schemas } from '../constants/entities';
import { FETCH_BAYONETS, FETCH_BAYONET_CAMERAS, FETCH_BAYONET_SDK_CAMERAS, SUBMIT_BAYONET, SUBMIT_BAYONET_SDK, RESET_BAYONET_NAME } from '../constants/actionTypes';

export const fetchBayonetsReq = options => ({
  [CALL_API]: {
    type: FETCH_BAYONETS,
    schema: Schemas.BAYONET_ARRAY,
    endpoint: '/bayonet',
    options,
  },
});

export const fetchBayonets = options => (dispatch, getState) => {
  const { filter } = getState();
  const newOptions = {
    ...options,
    ...filter.bayonets,
  };

  return dispatch(fetchBayonetsReq(newOptions));
};

export const fetchBayonetCameras = (id, options) => ({
  [CALL_API]: {
    type: FETCH_BAYONET_CAMERAS,
    method: 'GET',
    endpoint: `/camera/bcpage/${id}`,
    options,
  },
});

export const fetchBayonetSdkCameras = (id, options) => ({
  [CALL_API]: {
    type: FETCH_BAYONET_SDK_CAMERAS,
    method: 'GET',
    endpoint: `/camera/bcSdk/${id}`,
    options,
  },
});

export const submitBayonetSdk = payload => ({
  [CALL_API]: {
    type: SUBMIT_BAYONET_SDK,
    payload,
    method: 'POST',
    endpoint: '/camera/bcSdk',
  },
});

export const submitBayonet = payload => ({
  [CALL_API]: {
    type: SUBMIT_BAYONET,
    schema: Schemas.BAYONET,
    payload,
    method: 'POST',
    endpoint: '/bayonet',
  },
});

// 卡口重命名
export const renameBayonet = (id, payload) => ({
  [CALL_API]: {
    type: RESET_BAYONET_NAME,
    schema: Schemas.BAYONET,
    method: 'PUT',
    endpoint: `/bayonet/${id}`,
    payload,
  },
});
