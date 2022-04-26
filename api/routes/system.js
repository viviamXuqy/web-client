import express from 'express';
import faker from 'faker';

import { getSdks, sdk, getUsers, user, getLogs, userInfo } from '../schema/system';

const router = express.Router();

router.get('/user/info', (req, res) => {
  res.json({
    code: 200,
    result: { ...userInfo },
  });
});

router.get('/event', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const sdks = getSdks(pageSize > 10 ? 10 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 8,
      total: faker.random.number({ min: 50, max: 500 }),
      data: sdks,
    },
  });
});

router.post('/event', (req, res) => {
  res.json({
    code: 200,
    result: sdk,
  });
});


router.delete('/event/:id', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.put('/event/:id', (req, res) => {
  res.json({
    code: 200,
    result: sdk,
  });
});

router.put('/event/switch/:id', (req, res) => {
  const { status } = req.body;
  res.json({
    code: 200,
    result: {
      ...sdk,
      status: status.toString() === '0' ? '1' : '0',
    },
  });
});


router.put('/mode', (req, res) => {
  res.json({
    code: 200,
  });
});

router.put('/config', (req, res) => {
  res.json({
    code: 200,
  });
});

router.post('/time/ntp', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.post('/time/manual', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.get('/log', (req, res) => {
  const { page = 1, pageSize = 14 } = req.query;
  const logs = getLogs(pageSize > 14 ? 14 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 14,
      total: faker.random.number({ min: 50, max: 500 }),
      data: logs,
    },
  });
});

router.delete('/log/:ids', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.get('/user', (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const users = getUsers(pageSize > 10 ? 10 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 8,
      total: faker.random.number({ min: 50, max: 500 }),
      data: users,
    },
  });
});

router.post('/user', (req, res) => {
  res.json({
    code: 200,
    result: sdk,
  });
});


router.delete('/user/:id', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.put('/user/:id', (req, res) => {
  res.json({
    code: 200,
    result: sdk,
  });
});

router.put('/user/switch/:id', (req, res) => {
  const { status } = req.body;
  res.json({
    code: 200,
    result: {
      ...user,
      status: status.toString() === '0' ? '1' : '0',
    },
  });
});

export default router;
