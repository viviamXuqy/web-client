import faker from 'faker';
import moment from 'moment';

import { img } from './image';
import { encodeUnicode } from '../utils';

export const vehicleTask = {
  id: faker.random.uuid(),
  originalTaskName: faker.internet.userName(),
  status: faker.random.number({
    min: 0,
    max: 2,
  }),
  originalTaskStatus: '进行中',
};

export const getVehicleTask = (pageSize = 10) => new Array(pageSize).fill().map(() => ({
  id: faker.random.uuid(),
  originalTaskName: faker.internet.userName(),
  status: faker.random.number({
    min: 0,
    max: 2,
  }),
  originalTaskStatus: '进行中',
}));

export const getAnalysis = {
  analysis: {
    car: faker.random.number({ min: 0, max: 10000 }),
    van: faker.random.number({ min: 0, max: 10000 }),
    bus: faker.random.number({ min: 0, max: 10000 }),
    truck: faker.random.number({ min: 0, max: 10000 }),
    motorbike: faker.random.number({ min: 0, max: 10000 }),
    tricycle: faker.random.number({ min: 0, max: 10000 }),
    bike: faker.random.number({ min: 0, max: 10000 }),
    person: faker.random.number({ min: 0, max: 10000 }),
  },
  taskId: faker.random.uuid(),
};

export const getMonitorData = {
  vehicle: [
    {
      attri: {
        type: encodeUnicode('轿车'),
        plate: encodeUnicode('浙A12345'),
        brand: encodeUnicode('五菱宏光'),
        carcolor: encodeUnicode('银色'),
        platecolor: encodeUnicode('蓝色'),
      },
      image: img,
      ratio: '100x200',
    },
    {
      attri: {
        type: encodeUnicode('SUV'),
        plate: encodeUnicode('川A12345'),
        brand: encodeUnicode('凯迪拉克'),
        carcolor: encodeUnicode('白色'),
        platecolor: encodeUnicode('绿色'),
      },
      image: img,
      ratio: '100x200',
    },
  ],
  person: [
    {
      attri: {
        type: encodeUnicode('行人'),
        age: encodeUnicode('中年'),
        bag: encodeUnicode('未拎东西'),
        baby: encodeUnicode('未抱小孩'),
        bottomcolor: encodeUnicode('蓝色'),
        bottomtype: encodeUnicode('长裤'),
        orientation: encodeUnicode('侧面'),
        umbrella: encodeUnicode('未打伞'),
        hair: encodeUnicode('短发'),
        hat: encodeUnicode('未戴帽子'),
        sex: encodeUnicode('男'),
        uppercolor: encodeUnicode('蓝色'),
        uppertype: encodeUnicode('长袖'),
        knapsack: encodeUnicode('未背双肩包'),
      },
      image: img,
      ratio: '60x80',
    },
    {
      attri: {
        type: encodeUnicode('三轮车'),
        age: encodeUnicode('少年'),
        bag: encodeUnicode('拎东西'),
        baby: encodeUnicode('抱小孩'),
        bottomcolor: encodeUnicode('红色'),
        bottomtype: encodeUnicode('端裤'),
        orientation: encodeUnicode('正面'),
        umbrella: encodeUnicode('打伞'),
        hair: encodeUnicode('长发'),
        hat: encodeUnicode('戴帽子'),
        sex: encodeUnicode('女'),
        uppercolor: encodeUnicode('灰色'),
        uppertype: encodeUnicode('端袖'),
        knapsack: encodeUnicode('背双肩包'),
      },
      image: img,
      ratio: '60x80',
    },
  ],
  time: moment(faker.date.recent()).valueOf(),
};

export const vehicleResult = {
  id: faker.random.uuid(),
  plate: '浙A8888', // 车牌号
  type: '宝马', // 车辆型号
  color: '红色', // 车颜色
  count: faker.random.number({ min: 0, max: 100 }),
  originTaskId: faker.random.uuid(),
};

export const getVehicleResult = (pageSize = 10) => new Array(pageSize).fill().map(() => ({
  id: faker.random.uuid(),
  plate: '浙A8888', // 车牌号
  type: '宝马', // 车辆型号
  color: '红色', // 车颜色
  count: faker.random.number({ min: 0, max: 100 }),
  originTaskId: faker.random.uuid(),
}));

export const vehicleDetail = {
  id: faker.random.uuid(),
  taskId: faker.random.uuid(),
  plate: '浙A8888', // 车牌号
  type: '宝马', // 车辆型号
  color: '红色', // 车颜色
  count: faker.random.number({ min: 0, max: 100 }),
  image: faker.image.avatar(),
  driver: [{
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    catchTime: '1529355966000',
    originTaskId: '2344,5555',
    image: faker.image.avatar(),
  }, {
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    catchTime: '1529355966000',
    originTaskId: '2344,5555',
    image: faker.image.avatar(),
  }, {
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    catchTime: '1529355966000',
    originTaskId: '2344,5555',
    image: faker.image.avatar(),
  }, {
    id: faker.random.uuid(),
    name: faker.internet.userName(),
    catchTime: '1529355966000',
    originTaskId: '2344,5555',
    image: faker.image.avatar(),
  }],
};

export const getViolationTask = (pageSize = 10) => new Array(pageSize).fill().map(() => ({
  id: faker.random.uuid(),
  taskName: faker.internet.userName(),
  type: '1', // 任务类型
  originalTaskName: faker.internet.userName(), // 基础任务
  camera: '大华摄像头', // 摄像头
  time: moment(faker.date.recent()).valueOf(), // 时间
  taskStatus: 1, // 任务状态
  count: faker.random.number({ min: 0, max: 100 }), // 结果数量
  switchStatus: faker.random.number({ min: 0, max: 1 }), // 开关 0关闭/1开启
}));

export const getViolationResult = (pageSize = 10) => new Array(pageSize).fill().map(() => ({
  id: faker.random.uuid(),
  type: '1', // 违章类型
  mainType: faker.internet.userName, // 违章主体类型
  plate: '浙A8888', // 车牌号
  time: moment(faker.date.recent()).valueOf(), // 时间
  taskId: faker.random.uuid(),
  address: faker.address.streetName(),
}));
