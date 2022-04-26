import { CALL_API } from '../middleware/api';
import { FETCH_RESOURCES, FETCH_RESOURCE_TREE, FETCH_RESOURCE_TREE_FILE, UPLOAD_FILE } from '../constants/actionTypes';

export const fetchResources = options => ({
  [CALL_API]: {
    type: FETCH_RESOURCES,
    method: 'GET',
    endpoint: '/resource/page',
    options,
  },
});

export const fetchResourceTree = payload => ({
  [CALL_API]: {
    type: FETCH_RESOURCE_TREE,
    method: 'POST',
    endpoint: '/resource/tree',
    payload,
  },
});

export const fetchResourceTreeFile = payload => ({
  [CALL_API]: {
    type: FETCH_RESOURCE_TREE_FILE,
    method: 'POST',
    endpoint: '/resource/tree/file',
    payload,
  },
});

// 上传文件
export const uploadFile = formData => ({
  [CALL_API]: {
    type: UPLOAD_FILE,
    method: 'POST',
    endpoint: '/file/upload',
    formData,
  },
});
