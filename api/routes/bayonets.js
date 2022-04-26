import express from 'express';
import faker from 'faker';

import { getBayonets, bayonet } from '../schema/bayonets';

const router = express.Router();

router.get('/', (req, res) => {
  const { page = 1, pageSize = 4 } = req.query;
  const bayonets = getBayonets(pageSize > 4 ? 4 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 4,
      total: faker.random.number({ min: 50, max: 500 }),
      data: bayonets,
    },
  });
});

router.post('/', (req, res) => {
  const bayonetTemp = req.body;

  res.json({
    code: 200,
    result: {
      _id: faker.random.uuid(),
      ...bayonetTemp,
    },
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { bayonetName } = req.body;
  res.json({
    code: 200,
    result: {
      ...bayonet,
      _id: id,
      name: bayonetName,
    },
  });
});

export default router;
