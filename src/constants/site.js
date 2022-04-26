export const SITE_CONFIG = {
  custom_cards: false,
};

export const WORKDAYS = [1, 2, 3, 4, 5, 6, 7];
export const ROLES = {
  admin: 'admin',
};

export const MENUS = {
  HOME: {
    path: '/',
    name: 'App.header.tab.index', // 首页
  },
  CAMERAS: {
    path: '/cameras',
    name: 'App.header.tab.equipment', // 设备管理
    subMenu: [
      {
        path: '/cameras/ipc',
        name: 'App.ipc.title', // IPC管理
        icon: 'folder-open',
        meta: {
          grade: [1, 2, 3],
        },
      },
      {
        path: '/cameras/nvr',
        name: 'App.cameras.nvr', // NVR管理
        cicon: 'nrv',
        meta: {
          grade: [1, 2, 3],
        },
      },
    ],
  },
  TASKS: {
    path: '/tasks',
    name: 'App.header.tab.task', // 结构化任务
    subMenu: [
      {
        path: '/tasks/analysis',
        name: 'App.RT.title', // 实时分析
        cicon: 'real-timeanalysis',
        meta: {
          grade: [1, 2],
        },
      },
      {
        path: '/tasks/video',
        name: 'App.results.2', // 视频分析
        cicon: 'videoanalysis',
        meta: {
          grade: [1, 2],
        },
      },
      {
        path: '/tasks/pic',
        name: 'App.results.3', // 图片分析
        cicon: 'Imageanalysis',
        meta: {
          grade: [1, 2],
        },
      },
    ],
  },
  RESULTS: {
    path: '/results',
    name: 'App.header.tab.result', // 识别结果
    subMenu: [
      {
        path: '/results/resultsList',
        name: 'App.results.resultList', // 结果列表
        cicon: 'resultlist',
        meta: {
          grade: [1, 2, 3],
        },
      },
      {
        path: '/results/task',
        name: 'App.results.taskList', // 任务列表
        cicon: 'rectangleCopy',
        meta: {
          grade: [1, 2, 3],
        },
      },
    ],
  },
  SMARTAPP: {
    path: '/smartapp',
    name: 'App.header.tab.smartapp', // 智能应用
  },
  SYSTEM: {
    path: '/system',
    name: 'App.header.tab.system', // 系统管理
    subMenu: [
      {
        path: '/system/setting',
        name: 'App.system.config', // 系统配置
        icon: 'setting',
        meta: {
          grade: [1],
        },
      },
      // {
      //   path: '/system/log',
      //   name: 'App.system.log', // 日志
      //   cicon: 'note',
      //   meta: {
      //     grade: [1, 2],
      //   },
      // },
    ],
  },
};
export const AUTH = {
  1: ['/', '/cameras/ipc', '/cameras/nvr', '/tasks/analysis', '/tasks/video',
    '/tasks/pic', '/results/resultsList', '/results/task', '/system/setting', '/system/log',
    '/smartapp', '/smartapp/driver', '/smartapp/monitor', '/smartapp/violation',
    '/smartapp/reviewplate/tasks', '/smartapp/reviewplate/results', '/smartapp/reviewplate/preview'],
  2: ['/', '/cameras/ipc', '/cameras/nvr', '/tasks/analysis', '/tasks/video',
    '/tasks/pic', '/results/resultsList', '/results/task', '/system/log',
    '/smartapp', '/smartapp/driver', '/smartapp/monitor', '/smartapp/violation',
    '/smartapp/reviewplate/tasks', '/smartapp/reviewplate/results', '/smartapp/reviewplate/preview'],
  3: ['/', '/cameras/ipc', '/cameras/nvr', '/results/resultsList', '/results/task',
    '/smartapp', '/smartapp/driver', '/smartapp/monitor', '/smartapp/violation',
    '/smartapp/reviewplate/tasks', '/smartapp/reviewplate/results', '/smartapp/reviewplate/preview'],
};

export const ROLES_AUTHORITY = {
  1: ['HOME', 'CAMERAS', 'TASKS', 'RESULTS', 'SMARTAPP', 'SYSTEM'],
  2: ['HOME', 'CAMERAS', 'TASKS', 'RESULTS', 'SMARTAPP', 'SYSTEM'],
  3: ['HOME', 'CAMERAS', 'RESULTS', 'SMARTAPP'],
};

export const MENUS_REL = grade =>
  Object.keys(MENUS).reduce((obj, key) => {
    let { path } = MENUS[key];
    const { subMenu } = MENUS[key];
    if (subMenu) {
      const subMenuTemp = subMenu.find(sub => (sub.meta.grade.includes(+grade)));
      path = subMenuTemp ? subMenuTemp.path : path;
    }

    const data = {
      ...obj,
      [key]: {
        ...MENUS[key],
        path,
      },
    };

    return data;
  }, {});

export const FORM_ITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};
