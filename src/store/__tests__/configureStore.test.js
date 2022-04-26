import configureStore from 'store/configureStore';
import { normalize } from 'normalizr';
import { camelizeKeys } from 'humps';
import { Schemas } from 'constants/entities';
import { createMemoryHistory } from 'history';

import { getTasks, getTaskresults } from '../../../api/schema/tasks';
import { getCameras } from '../../../api/schema/cameras';
import { getBayonets } from '../../../api/schema/bayonets';
import { getNvrs } from '../../../api/schema/nvr';
import { getLogs, userInfo } from '../../../api/schema/system';

const getResults = (pageSize = 8) => new Array(pageSize).fill().map((item, index) => (
  {
    _id: index,
    taskId: index,
    time: 1529355966000,
    taskType: 1,
    targetType: 'car',
    taskName: 'test',
  }
));

describe('configureStore', () => {
  it('should render without errors', () => {
    const history = createMemoryHistory('/');

    expect(configureStore(history)).toMatchObject({});
  });
});

const getIds = (result, schema) => {
  const data = {
    key: Array.isArray(schema) ? schema[0]._key : schema._key,
    ...normalize(camelizeKeys(result), schema),
  };
  let ids = [];

  if (Array.isArray(data.result)) {
    ids = [...data.result];
  }
  ids.filter(idsTemp => idsTemp);

  return ids;
};

const user = userInfo;

const meta = {
  results: {
    page: 1,
    pageSize: 8,
    total: 100,
  },
  taskresults: {
    page: 1,
    pageSize: 8,
    total: 100,
  },
  cameras: {
    page: 1,
    pageSize: 14,
    total: 100,
  },
  bayonets: {
    page: 1,
    pageSize: 10,
    total: 100,
  },
  tasks: {
    page: 1,
    pageSize: 14,
    total: 100,
  },
  logs: {
    page: 1,
    pageSize: 14,
    total: 100,
  },
  nvrs: {
    page: 1,
    pageSize: 14,
    total: 100,
  },
};

const filter = {
  results: {},
  taskresults: {},
  cameras: {},
  bayonets: {},
  tasks: {},
  logs: {},
  nvrs: {},
};

const entities = {
  results: getResults(meta.results.pageSize),
  resultsIds: getIds(getResults(meta.results.pageSize), Schemas.RESULT_ARRAY),
  taskresults: getTaskresults(meta.taskresults.pageSize),
  taskresultsIds: getIds(getTaskresults(meta.taskresults.pageSize), Schemas.TASKRESULT_ARRAY),
  cameras: getCameras(meta.cameras.pageSize),
  camerasIds: getIds(getCameras(meta.cameras.pageSize), Schemas.CAMERA_ARRAY),
  bayonets: getBayonets(meta.bayonets.pageSize),
  bayonetsIds: getIds(getBayonets(meta.bayonets.pageSize), Schemas.BAYONET_ARRAY),
  tasks: getTasks(meta.tasks.pageSize),
  tasksIds: getIds(getTasks(meta.tasks.pageSize), Schemas.TASK_ARRAY),
  logs: getLogs(meta.logs.pageSize),
  logsIds: getIds(getLogs(meta.logs.pageSize), Schemas.LOG_ARRAY),
  nvrs: getNvrs(meta.nvrs.pageSize),
  nvrsIds: getIds(getNvrs(meta.nvrs.pageSize), Schemas.NVR_ARRAY),
};

export default {
  state: {
    user,
    filter,
    meta,
    entities,
  },
};
