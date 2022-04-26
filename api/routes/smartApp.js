import faker from 'faker';
import express from 'express';
import moment from 'moment'; // eslint-disable-line

import { getVehicleTask, getAnalysis, getMonitorData, getVehicleResult, vehicleDetail, getViolationTask, getViolationResult } from '../schema/smartApp';

const router = express.Router();

// 机动车任务结果详情
router.get('/vehicle/result/:id', (req, res) => {
  res.json({
    code: 200,
    result: vehicleDetail,
  });
});

// 获取机动车任务列表
router.get('/vehicle/task/list', (req, res) => {
  const { page, pageSize } = req.query;
  const results = getVehicleTask(pageSize > 8 ? 8 : +pageSize);
  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 8,
      total: faker.random.number({ min: 50, max: 500 }),
      data: results,
    },
  });
});

router.get('/monitor/analysis/:id', (req, res) => {
  res.json({
    code: 200,
    result: JSON.stringify(getAnalysis),
  });
});

// 创建机动车任务
router.post('/vehicle/task', (req, res) => {
  res.json({
    code: 200,
    result: {
      id: faker.random.uuid(),
      originalTaskId: faker.random.uuid(),
      status: faker.random.number({ min: 0, max: 1 }),
    },
  });
});

router.get('/monitor/data/:id', (req, res) => {
  res.json({
    code: 200,
    result: JSON.stringify({ ...getMonitorData, time: moment(faker.date.recent()).valueOf() }),
  });
});

router.get('/monitor/playPath/:id', (req, res) => {
  res.json({
    code: 200,
    result: {
      // url: 'rtmp://172.16.105.15:8088/live/0',
      url: 'rtmp://202.69.69.180:443/webcast/bshdlive-pc',
    },
  });
});

// 获取机动车驾驶监控-结果列表,检索结果列表
router.get('/vehicle/result', (req, res) => {
  const { page = 1, pageSize = 8 } = req.query;
  const results = getVehicleResult(pageSize > 8 ? 8 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 8,
      total: faker.random.number({ min: 50, max: 500 }),
      data: results,
    },
  });
});

// 批量关闭任务
router.post('/vehicle/task/close', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 清空任务
router.delete('/vehicle/task', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 批量删除任务
router.delete('/vehicle/task/:ids', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 实时交通监控开启
router.post('/monitor/start', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 实时交通监控关闭
router.post('/monitor/stop', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 批量删除结果
router.delete('/vehicle/result/:ids', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 清空结果
router.delete('/vehicle/result', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 开启任务
router.post('/vehicle/task/start', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

/**
违章监控管理
 * */

// 获取违章任务列表
router.get('/violation/list', (req, res) => {
  const { page = 1, pageSize = 8 } = req.query;
  const results = getViolationTask(pageSize > 8 ? 8 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 8,
      total: faker.random.number({ min: 50, max: 500 }),
      data: results,
    },
  });
});

// 批量删除违章任务
router.delete('/violation/:ids', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 清空任务
router.delete('/violation/all', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 监控任务开关
router.put('/violation/switch/:id', (req, res) => {
  res.json({
    code: 200,
  });
});

// 新建违章任务
router.post('/violation', (req, res) => {
  res.json({
    code: 200,
    result: {
      id: faker.random.uuid(),
      originalTaskId: faker.random.uuid(),
      area: [[9, 6, 15, 80], [10, 20, 30, 40]],
      ratio: '483x260',
      time: '10000',
    },
  });
});

// 修改任务
router.put('/violation/:id', (req, res) => {
  res.json({
    code: 200,
  });
});

// 获取违章结果列表
router.get('/violation/result/list', (req, res) => {
  const { page = 1, pageSize = 8 } = req.query;
  const results = getViolationResult(pageSize > 8 ? 8 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 8,
      total: faker.random.number({ min: 50, max: 500 }),
      data: results,
    },
  });
});

// 批量删除违章结果
router.delete('/violation/result/:ids', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 清空结果
router.delete('/violation/result/all', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

// 违章结果详细信息-城市道路违停
router.get('/violation/result/:id', (req, res) => {
  res.json({
    code: 200,
    in: moment(faker.date.recent()).valueOf(), // 驶入时间
    plate: moment(faker.date.recent()).valueOf(), // 车牌取证时间
    timeOut: moment(faker.date.recent()).valueOf(), // 超时违章时间
  });
});

// 重置结果
router.delete('/monitor/reset/:ids', (req, res) => {
  res.json({
    code: 200,
    result: null,
  });
});

export default router;
