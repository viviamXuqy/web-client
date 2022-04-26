import faker from 'faker';
import express from 'express';

import { getResults, result } from '../schema/results';

const router = express.Router();

router.get('/', (req, res) => {
  const { page, pageSize } = req.query;
  const results = getResults(pageSize > 8 ? 8 : +pageSize);
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

router.get('/:id', (req, res) => {
  res.json({
    code: 200,
    result,
  });
});

router.delete('/:ids/:taskId', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.delete('/all', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

export default router;
