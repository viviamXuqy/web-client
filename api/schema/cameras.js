import faker from 'faker';

export const camera = {
  _id: faker.random.uuid(),
  bayonetId: faker.random.uuid(),
  bayonetName: faker.internet.userName(),
  name: faker.internet.userName(),
  deviceType: faker.random.number({
    min: 1,
    max: 2,
  }),
  ip: '127.0.0.1',
  port: faker.random.number({
    min: 1000,
    max: 9999,
  }),
  livePort: faker.random.number({
    min: 1000,
    max: 9999,
  }),
  state: +faker.random.boolean(),
  area: ['83.50,50.00', '76.50,176.00', '253.50,176.00', '263.50,74.00'],
  ratio: '439x260',
  rtsp: faker.internet.url(),
  type: faker.random.number({ min: 1, max: 2 }),
};

export const getCameras = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    _id: faker.random.uuid(),
    bayonetId: faker.random.uuid(),
    bayonetName: faker.internet.userName(),
    name: faker.internet.userName(),
    deviceType: faker.random.number({
      min: 1,
      max: 2,
    }),
    ip: '127.0.0.1',
    port: faker.random.number({
      min: 1000,
      max: 9999,
    }),
    livePort: faker.random.number({
      min: 1000,
      max: 9999,
    }),
    state: +faker.random.boolean(),
    area: ['83.50,50.00', '76.50,176.00', '253.50,176.00', '263.50,74.00'],
    ratio: '800x700',
    rtsp: faker.internet.url(),
    type: faker.random.number({ min: 1, max: 2 }),
  };
});

export const getSdkCameras = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return faker.internet.url();
});
