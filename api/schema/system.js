import faker from 'faker';

export const sdk = {
  _id: faker.random.uuid(),
  id: faker.random.uuid(),
  name: faker.internet.userName(),
  url: faker.internet.url(),
  doType: 1,
  status: faker.random.number({
    min: 0,
    max: 1,
  }),
};

export const getSdks = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    _id: faker.random.uuid(),
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    url: faker.internet.url(),
    type: 1,
    status: faker.random.number({
      min: 0,
      max: 1,
    }),
  };
});

export const getLogs = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    _id: faker.random.uuid(),
    time: 1529355966000,
    funType: faker.random.number({
      min: 1,
      max: 3,
    }),
    doType: faker.random.number({
      min: 1,
      max: 3,
    }),
    content: faker.lorem.text(),
    recordId: faker.random.uuid(),
    taskType: faker.random.number({
      min: 1,
      max: 3,
    }),
  };
});

export const user = {
  _id: faker.random.uuid(),
  userId: faker.random.uuid(),
  username: faker.internet.userName(),
  password: faker.random.number(),
  status: faker.random.number({
    min: 0,
    max: 1,
  }),
  grade: faker.random.number({
    min: 1,
    max: 3,
  }),
};

export const getUsers = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    _id: faker.random.uuid(),
    userId: faker.random.uuid(),
    username: faker.internet.userName(),
    password: faker.internet.password(),
    status: faker.random.number({
      min: 0,
      max: 1,
    }),
    grade: '1',
  };
});

export const userInfo = {
  _id: faker.random.uuid(),
  username: faker.name.findName(),
  role: 'user',
  grade: '1',
};
