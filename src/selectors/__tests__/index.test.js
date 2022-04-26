import {
  getResults,
  getTaskResults,
  getCameras,
  getBayonets,
  getTasks,
  getLogs,
  getNvrs,
} from 'selectors';

import configureStore from '../../store/__tests__/configureStore.test';

const { state } = configureStore;

const getMapData = (ids, datas) => {
  const obj = new Map();

  ids.forEach(id => {
    obj.set(id, {
      ...datas[id],
      id: `${id}`,
    });
  });

  return obj;
};

describe('tests for selectors', () => {
  it('`getResults` should render right data', () => {
    expect(getResults(state)).toEqual(
      getMapData(state.entities.resultsIds, state.entities.results),
    );
  });

  it('`getTaskResults` should render right data', () => {
    expect(getTaskResults(state)).toEqual(
      getMapData(state.entities.taskresultsIds, state.entities.taskresults),
    );
  });

  it('`getCameras` should render right data', () => {
    expect(getCameras(state)).toEqual(
      getMapData(state.entities.camerasIds, state.entities.cameras),
    );
  });

  it('`getBayonets` should render right data', () => {
    expect(getBayonets(state)).toEqual(
      getMapData(state.entities.bayonetsIds, state.entities.bayonets),
    );
  });

  it('`getTasks` should render right data', () => {
    expect(getTasks(state)).toEqual(
      getMapData(state.entities.tasksIds, state.entities.tasks),
    );
  });

  it('`getLogs` should render right data', () => {
    expect(getLogs(state)).toEqual(
      getMapData(state.entities.logsIds, state.entities.logs),
    );
  });

  it('`getNvrs` should render right data', () => {
    expect(getNvrs(state)).toEqual(
      getMapData(state.entities.nvrsIds, state.entities.nvrs),
    );
  });
});
