import express from 'express';
import faker from 'faker';

import { getReviewPlateTasks, reviewPlateTask, getReviewPlateResults, reviewPlateStatistics } from '../schema/reviewPlates';
import { img } from '../schema/image';

const router = express.Router();

router.get('/video/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    code: 200,
    result: {
      ...reviewPlateTask,
      _id: id,
      status: faker.random.number({ min: 0, max: 3 }),
    },
  });
});

router.get('/video/plate/overview/:id', (req, res) => {
  const { id } = req.params;

  res.json({
    code: 200,
    result: {
      ...reviewPlateStatistics,
      _id: id,
    },
  });
});

router.get('/video', (req, res) => {
  const { page = 1, pageSize = 14 } = req.query;
  const reviewTasks = getReviewPlateTasks(pageSize > 14 ? 14 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 14,
      total: faker.random.number({ min: 50, max: 500 }),
      data: reviewTasks,
    },
  });
});

router.get('/video/image/:id/:quality', (req, res) => {
  res.json({
    code: 200,
    result: img,
  });
});

router.put('/video/setting/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    code: 200,
    result: {
      ...reviewPlateTask,
      _id: id,
      area: [],
    },
  });
});

router.put('/video/start/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  res.json({
    code: 200,
    result: {
      ...reviewPlateTask,
      _id: id,
      status,
    },
  });
});

router.get('/video/plate/result', (req, res) => {
  const { page = 1, pageSize = 14 } = req.query;
  const reviewTaskResults = getReviewPlateResults(pageSize > 14 ? 14 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 14,
      total: faker.random.number({ min: 50, max: 500 }),
      data: reviewTaskResults,
    },
  });
});

export default router;
