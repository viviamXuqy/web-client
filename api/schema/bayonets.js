import faker from 'faker';

export const getBayonets = (pageSize = 10) => //eslint-disable-line
  new Array(pageSize > 100 ? 100 : pageSize).fill()
    .map(() => ({
      _id: faker.random.uuid(),
      bayonetId: faker.random.uuid(),
      name: faker.name.lastName(),
      deviceType: faker.internet.userName(),
      ip: '127.0.0.1',
      account: faker.internet.userName(),
      pwd: faker.internet.password(),
      port: faker.random.number({
        min: 1000,
        max: 9999,
      }),
    }));

export const bayonet = {
  _id: faker.random.uuid(),
  bayonetId: faker.random.uuid(),
  name: faker.name.lastName(),
  deviceType: faker.internet.userName(),
  ip: '127.0.0.1',
  account: faker.internet.userName(),
  pwd: faker.internet.password(),
  port: faker.random.number({
    min: 1000,
    max: 9999,
  }),
};
