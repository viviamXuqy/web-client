import { createSelector } from 'reselect';

const taskresultsSelector = state => state.entities.taskresults;
const taskresultsIdsSelector = state => state.entities.taskresultsIds;
export const getTaskResults = createSelector(
  taskresultsIdsSelector,
  taskresultsSelector,
  (ids, taskresults) => {
    const obj = new Map();

    ids.forEach(id => {
      obj.set(id, {
        ...taskresults[id],
        id: `${id}`,
      });
    });

    return obj;
  },
);

const resultsSelector = state => state.entities.results;
const resultsIdsSelector = state => state.entities.resultsIds;
export const getResults = createSelector(
  resultsIdsSelector,
  resultsSelector,
  (ids, results) => {
    const obj = new Map();

    ids.forEach(id => {
      obj.set(id, {
        ...results[id],
        id: `${id}`,
      });
    });

    return obj;
  },
);

const camerasSelector = state => state.entities.cameras;
const camerasIdsSelector = state => state.entities.camerasIds;
export const getCameras = createSelector(
  camerasIdsSelector,
  camerasSelector,
  (ids, cameras) => {
    const obj = new Map();

    ids.forEach(id => {
      obj.set(id, {
        ...cameras[id],
        id: `${id}`,
      });
    });

    return obj;
  },
);

const bayonetsSelector = state => state.entities.bayonets;
const bayonetsIdsSelector = state => state.entities.bayonetsIds;
export const getBayonets = createSelector(
  bayonetsIdsSelector,
  bayonetsSelector,
  (ids, bayonets) => {
    const obj = new Map();

    ids.forEach(id => {
      obj.set(id, {
        ...bayonets[id],
        id: `${id}`,
      });
    });

    return obj;
  },
);

const tasksSelector = state => state.entities.tasks;
const tasksIdsSelector = state => state.entities.tasksIds;
export const getTasks = createSelector(
  tasksIdsSelector,
  tasksSelector,
  (ids, tasks) => {
    const obj = new Map();

    ids.forEach(id => {
      obj.set(id, {
        ...tasks[id],
        id: `${id}`,
      });
    });

    return obj;
  },
);

const logsSelector = state => state.entities.logs;
const logsIdsSelector = state => state.entities.logsIds;
export const getLogs = createSelector(
  logsIdsSelector,
  logsSelector,
  (ids, logs) => {
    const obj = new Map();

    ids.forEach(id => {
      obj.set(id, {
        ...logs[id],
        id: `${id}`,
      });
    });

    return obj;
  },
);

const nvrsSelector = state => state.entities.nvrs;
const nvrsIdsSelector = state => state.entities.nvrsIds;
export const getNvrs = createSelector(
  nvrsIdsSelector,
  nvrsSelector,
  (ids, nvrs) => {
    const obj = new Map();

    ids.forEach(id => {
      obj.set(id, {
        ...nvrs[id],
        id: `${id}`,
      });
    });

    return obj;
  },
);
