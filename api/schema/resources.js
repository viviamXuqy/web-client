import faker from 'faker';

export const resourceFolders = {
  id: faker.random.uuid(),
  name: faker.internet.userName(),
};

export const getResourceFolders = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    path: faker.random.uuid(),
  };
});

export const getFiles = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    path: faker.random.uuid(),
  };
});

export const getChildTree2 = (pageSize = 10) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    key: faker.random.uuid(),
    name: faker.internet.userName(),
    path: faker.random.uuid(),
  };
});

export const getChildTree = (pageSize = 5) => new Array(pageSize).fill().map(() => { //eslint-disable-line
  return {
    name: faker.internet.userName(),
    path: faker.random.uuid(),
    children: getChildTree2(),
    key: faker.random.uuid(),
  };
});
