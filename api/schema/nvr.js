import faker from 'faker';

export const nvr = {
  _id: faker.random.uuid(),
  nvrName: faker.internet.userName(),
  port: faker.random.number({
    min: 80,
    max: 9999,
  }),
  nvrIp: '127.0.0.1',
  useDiskSize: '1TB',
  tatolDiskSize: '5TB',
};

export const getNvrs = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    _id: faker.random.uuid(),
    nvrName: faker.internet.userName(),
    port: faker.random.number({
      min: 80,
      max: 9999,
    }),
    nvrIp: '127.0.0.1',
    useDiskSize: '1TB',
    tatolDiskSize: '5TB',
  };
});

