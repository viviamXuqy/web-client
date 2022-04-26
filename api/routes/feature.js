import express from 'express';
import faker from 'faker';

import { getFeatures } from '../schema/features';

const router = express.Router();

router.get('/', (req, res) => {
  const carFeatures = getFeatures(0).concat([{
    _id: '6',
    type: 0,
    markName: faker.internet.userName(),
    name: faker.internet.userName(),
    model: 1,
  }]);
  const personFeatures = getFeatures(10).concat([
    {
      _id: '7',
      type: 10,
      markName: faker.internet.userName(),
      name: faker.internet.userName(),
      model: 1,
    },
    {
      _id: '8',
      type: 10,
      markName: faker.internet.userName(),
      name: faker.internet.userName(),
      model: 1,
    },
  ]);

  res.json({
    code: 200,
    result: {
      _id: faker.random.uuid,
      carFeatures,
      personFeatures,
      total: faker.random.number({
        min: 1,
        max: 10,
      }),
    },
  });
});

export default router;
