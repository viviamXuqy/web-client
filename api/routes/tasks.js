import express from 'express';
import faker from 'faker';

import { getTasks, task, getTaskresults, getActiveTask } from '../schema/tasks';

const router = express.Router();

router.get('/', (req, res) => {
  const { page = 1, pageSize = 14 } = req.query;
  const tasks = getTasks(pageSize > 14 ? 14 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 14,
      total: faker.random.number({ min: 50, max: 500 }),
      data: tasks,
    },
  });
});

router.post('/multi', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.delete('/:ids/:types/:deleteFile', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.put('/setStatus/:ids', (req, res) => {
  const { ids } = req.params;
  const { status } = req.body;
  res.json({
    code: 200,
    result: {
      ...task,
      _id: ids,
      status,
    },
  });
});

router.put('/setStatus', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.put('/set/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    code: 200,
    result: {
      ...task,
      _id: id,
    },
  });
});

router.delete('/all/:type', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.get('/result', (req, res) => {
  const { page = 1, pageSize = 8 } = req.query;
  const taskresults = getTaskresults(pageSize > 8 ? 8 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 8,
      total: faker.random.number({ min: 50, max: 500 }),
      data: taskresults,
    },
  });
});

router.delete('/result/:ids', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.get('/num', (req, res) => {
  res.json({
    code: 200,
    result: {
      num: faker.random.number({ min: 1, max: 50 }),
      total: faker.random.number({ min: 50, max: 500 }),
    },
  });
});

router.get('/activeTask', (req, res) => {
  res.json({
    code: 200,
    result: getActiveTask(),
  });
});

router.get('/camera/names', (req, res) => {
  const cameras = [];
  for (let i = 0; i < 10; i++) {
    cameras.push(faker.internet.userName());
  }
  res.json({
    code: 200,
    result: cameras,
  });
});

export default router;
