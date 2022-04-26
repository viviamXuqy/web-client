import express from 'express';
import faker from 'faker';

import { getNvrs, nvr } from '../schema/nvr';

const router = express.Router();

router.get('/', (req, res) => {
  const { page = 1, pageSize = 14 } = req.query;
  const nvrs = getNvrs(pageSize > 14 ? 14 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 14,
      total: faker.random.number({ min: 50, max: 500 }),
      data: nvrs,
    },
  });
});

router.post('/', (req, res) => {
  res.json({
    code: 200,
    result: nvr,
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nvrName, port, ip } = req.body;
  res.json({
    code: 200,
    result: {
      ...nvr,
      _id: id,
      nvrName,
      port,
      ip,
    },
  });
});

router.delete('/:ids', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

export default router;
