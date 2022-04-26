export const isDev = true;//process.env.NODE_ENV === 'development';
export const isProd = process.env.NODE_ENV === 'production';
export const proxy = 'http://localhost:3001/api';

const CONFIG = {
  ip: window.api().url,
  port: window.api().port,
  useLocation: window.useLocation(),
  lang: window.defaultLang(),
};

export const DEFALUT_LANG = CONFIG.lang;

export const API = CONFIG.useLocation ? `${window.location.protocol}//${window.location.hostname}:${CONFIG.port}` : `${CONFIG.ip}:${CONFIG.port}`;

export const API_URLS = {
  dev: '/api',
  prod: `${API}/api`,
};

export const API_URL =
  (isProd && API_URLS.prod) ||
  (isDev && API_URLS.dev);

export const BASE64_IMG_JPEG = 'data:image/jpeg;base64,';
export const TASK_TYPE = {
  ALL: 0, ANALYSIS: 1, VIDEO: 2, PIC: 3,
}; // 任务类型（1实时，2视频，3图集）
