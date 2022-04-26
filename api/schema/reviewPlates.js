import faker from 'faker';

import { result } from './results';

import { img } from './image';

const reg = new RegExp('-', 'g');
export const reviewPlateTask = {
  _id: faker.random.uuid().replace(reg, ''),
  name: faker.internet.userName(),
  area: ['83.50,50.00', '76.50,176.00', '253.50,176.00', '263.50,74.00'],
  ratio: '439x260',
  analysisList: ['/test.mp4'],
  type: 2,
  functionType: 'plateCheck',
  // 0关闭/1开启/2暂停3/完成
  status: faker.random.number({
    min: 0,
    max: 3,
  }),
  carFeatures: ['3', '5'],
  personFeatures: ['7'],
};

export const reviewPlateResult = {
  ...result,
  _id: faker.random.uuid().replace(reg, ''),
  taskId: faker.random.uuid().replace(reg, ''),
  taskName: faker.internet.userName(),
  taskType: 2,
  plateCheckedTime: '22:12:11',
  plate: {
    plateNo: '浙A xxx',
    plateColor: 'blue',
  },
  plateImage: img,
  ratio: '439x260',
  result: true,
};

export const getReviewPlateTasks = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    _id: faker.random.uuid().replace(reg, ''),
    name: faker.internet.userName(),
    area: ['83.50,50.00', '76.50,176.00', '253.50,176.00', '263.50,74.00'],
    ratio: '439x260',
    analysisList: ['/test.mp4'],
    type: 2,
    functionType: 'plateCheck',
    // 0关闭/1开启/2暂停3/完成
    status: faker.random.number({
      min: 0,
      max: 3,
    }),
    carFeatures: ['3', '5'],
    personFeatures: ['7'],
  };
});

export const getReviewPlateResults = (pageSize = 10) => new Array(pageSize).fill().map(() => ({
  ...result,
  _id: faker.random.uuid().replace(reg, ''),
  taskId: faker.random.uuid().replace(reg, ''),
  taskName: faker.internet.userName(),
  taskType: 2,
  plateCheckedTime: '22:12:11',
  plate: {
    plateNo: '浙A xxx',
    plateColor: 'blue',
  },
  plateImage: img,
  ratio: '439x260',
  result: true,
}));

export const reviewPlateStatistics = {
  _id: faker.random.uuid().replace(reg, ''),
  taskId: faker.random.uuid().replace(reg, ''),
  vehicleNums: faker.random.number({
    min: 0,
    max: 1000,
  }),
  identifiedNums: faker.random.number({
    min: 0,
    max: 1000,
  }),
  unidentifiedNums: faker.random.number({
    min: 0,
    max: 1000,
  }),
};

export const videoProgress = {
  taskId: faker.random.uuid().replace(reg, ''),
  progress: '100',
  current: `${faker.random.number({ min: 0, max: 999 })}`,
  total: `${faker.random.number({ min: 0, max: 999 })}`,
};

