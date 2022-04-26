import faker from 'faker';
import moment from 'moment';

export const task = {
  _id: faker.random.uuid(),
  bayonetId: faker.random.uuid(),
  bayonetName: faker.internet.userName(),
  cameraName: faker.internet.userName(),
  resourceName: faker.internet.userName(),
  name: faker.internet.userName(),
  type: faker.random.number({
    min: 1,
    max: 3,
  }),
  cameraId: faker.random.uuid(),
  timeType: faker.random.number({
    min: 1,
    max: 3,
  }),
  duration: ['2,3662000,32642000', '3,1531868465000,1531897321000', '2,7323000,9323000'],
  deviceType: faker.random.number({
    min: 1,
    max: 2,
  }),
  // 0关闭/1开启/2暂停
  status: faker.random.number({
    min: 0,
    max: 2,
  }),
  // (-1等待开始，-2错误，100完成)
  progress: faker.random.number({
    min: -1,
    max: 100,
  }),
  // （当前完成到哪一个）
  current: faker.random.number({
    min: 1,
    max: 100,
  }),
  // （总数量）
  total: faker.random.number({
    min: 1,
    max: 100,
  }),
  carFeatures: ['6'],
  personFeatures: ['7'],
};

export const getTasks = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    _id: faker.random.uuid(),
    bayonetId: faker.random.uuid(),
    bayonetName: faker.internet.userName(),
    cameraName: faker.internet.userName(),
    resourceName: faker.internet.userName(),
    name: faker.internet.userName(),
    endTime: 1529355966000,
    type: faker.random.number({
      min: 1,
      max: 3,
    }),
    cameraId: faker.random.uuid(),
    timeType: faker.random.number({
      min: 1,
      max: 3,
    }),
    duration: ['2,3662000,32642000', '3,1531868465000,1531897321000', '2,7323000,9323000'],
    deviceType: faker.random.number({
      min: 1,
      max: 2,
    }),
    // 0关闭/1开启/2暂停
    status: faker.random.number({
      min: 0,
      max: 2,
    }),
    // (-3进行中，-1等待开始，-2错误，100完成)
    progress: faker.random.number({
      min: -3,
      max: 100,
    }),
    // （当前完成到哪一个）
    current: faker.random.number({
      min: 1,
      max: 100,
    }),
    // （总数量）
    total: faker.random.number({
      min: 1,
      max: 100,
    }),
    carFeatures: [],
    personFeatures: ['8'],
    frequency: faker.random.number({ min: 1, max: 100 }),
  };
});

export const getTaskresults = (pageSize = 10) => new Array(pageSize).fill().map(() => ({
  _id: faker.random.uuid(),
  name: faker.internet.userName(),
  total: 121,
  endTime: moment(faker.date.recent()).valueOf(),
  autoInc: faker.random.number(),
  type: faker.random.number({
    min: 1,
    max: 3,
  }),
  resultId: faker.random.uuid(),
  image: faker.image.avatar(),
}));

export const getActiveTask = () => new Array(10).fill().map(() => ({
  originalTaskId: faker.random.uuid().replace(new RegExp('-', 'g'), ''),
  originalTaskName: faker.internet.userName(),
}));
