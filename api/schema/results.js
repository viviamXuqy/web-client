import faker from 'faker';

import { encodeUnicode } from '../utils';

export const result = {
  _id: faker.random.uuid(),
  taskId: faker.random.uuid(),
  time: '1529355966000',
  taskType: faker.random.number({
    min: 1,
    max: 3,
  }),
  targetType: 'car',
  taskName: faker.internet.userName(),
  address: faker.address.streetName(),
  ratio: '3392x2008',
  personFeatures: [
    {
      area: [248, 468, 66, 131],
      attri: {
        age: '中年',
        baby: '未抱小孩',
        bag: '未拎东西',
        bottomcolor: '灰',
        bottomtype: '长裤',
        glasses: '无眼镜',
        hair: '短发',
        hat: '未戴帽子',
        knapsack: '未背双肩包',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        orientation: '后',
        sex: '男',
        shoulderbag: '非单肩包',
        type: '摩托车',
        umbrella: '未打伞',
        uppercolor: '白',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
    {
      area: [547, 249, 185, 213],
      attri: {
        age: '青年',
        baby: '未抱小孩',
        bag: '未拎东西',
        barrow: '无手推车',
        bottomcolor: '深灰',
        bottomtype: '短裤',
        glasses: '戴眼镜',
        hair: '马尾',
        hat: '未戴帽子',
        knapsack: '未背双肩包',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        trolleycase: '无拉杆箱',
        orientation: '侧',
        sex: '女',
        shoulderbag: '非单肩包',
        type: '摩托车',
        umbrella: '未打伞',
        uppercolor: '黑',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
    {
      area: [590, 390, 271, 259],
      attri: {
        age: '青年',
        baby: '未抱小孩',
        bag: '未拎东西',
        bottomcolor: '灰',
        bottomtype: '长裤',
        glasses: '无眼镜',
        hair: '短发',
        hat: '未戴帽子',
        knapsack: '双肩包（有包）',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        orientation: '侧',
        sex: '男',
        shoulderbag: '非单肩包',
        type: '自行车',
        umbrella: '未打伞',
        uppercolor: '黑',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
    {
      area: [396, 524, 103, 326],
      attri: {
        age: '青年',
        baby: '未抱小孩',
        bag: '未拎东西',
        bottomcolor: '蓝',
        bottomtype: '长裤',
        glasses: '无眼镜',
        hair: '短发',
        hat: '未戴帽子',
        knapsack: '未背双肩包',
        mask: '无口罩',
        messengerbag: '非斜挎包',
        orientation: '侧',
        sex: '男',
        shoulderbag: '非单肩包',
        type: '自行车',
        umbrella: '未打伞',
        uppercolor: '白',
        uppertexture: '纯色',
        uppertype: '短袖',
      },
    },
  ],
  carFeatures: [
    {
      brand: // 车品牌，车品牌可能被识别成多种
      encodeUnicode('客车-金旅'),
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [9, 4, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: encodeUnicode('浙A12345'), // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [190, 225, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'car', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      encodeUnicode('克莱斯勒-大捷龙(进口)'),
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [709, 464, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: encodeUnicode('鄂A67890'), // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [990, 595, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'bus', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      encodeUnicode('客车-金旅'),
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [9, 4, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: encodeUnicode('浙A12345'), // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [190, 225, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'car', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      encodeUnicode('克莱斯勒-大捷龙(进口)'),
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [709, 464, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: encodeUnicode('鄂A67890'), // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [990, 595, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'bus', // 车类型，目前支持 car, bus, truck, motorbike
    },
    {
      brand: // 车品牌，车品牌可能被识别成多种
      encodeUnicode('客车-金旅'),
      brandrate: // 车品牌被识别的概率，每个车品牌和被识别的概率是一一对应的
      [10.31, 4.57, 3.92, 3.70, 3.43],
      cararea: // 车位置
      [9, 4, 611, 364],
      carrate: 89.07, // 车被检测到的概率
      plate: encodeUnicode('浙A12345'), // 车牌号码
      carcolor: 'red',
      platecolor: 'blue',
      platearea: // 车牌位置
      [190, 225, 263, 58],
      platerate: 91.18, // 车牌被检测到的概率
      type: 'car', // 车类型，目前支持 car, bus, truck, motorbike
    },
  ],
  objectFeatures: [
    {
      type: '行人',
      area: [100, 200, 60, 60],
    },
    {
      type: '车辆',
      area: [300, 400, 203, 150],
      occupantNum: 1,
    },
  ],
  personPose: [
    {
      type: '行人',
      area: [100, 200, 60, 60],
      pose: [
        { x: 20, y: 20 }, { x: 20, y: 30 },
      ],
    },
    {
      type: '行人',
      area: [300, 400, 60, 60],
      pose: [
        { x: 10, y: 20 }, { x: 20, y: 30 },
      ],
    },
  ],
};

export const getResults = (pageSize = 8) => new Array(pageSize).fill().map(() => (
  {
    _id: faker.random.uuid(),
    taskId: faker.random.uuid(),
    time: 1529355966000,
    taskType: faker.random.number({
      min: 1,
      max: 3,
    }),
    targetType: 'car',
    // image: faker.image.avatar(),
    taskName: faker.internet.userName(),
  }
));
