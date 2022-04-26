import express from 'express';
import faker from 'faker';

import { getResourceFolders, getChildTree, getFiles } from '../schema/resources';

const router = express.Router();

router.get('/page', (req, res) => {
  const { page = 1, pageSize = 14 } = req.query;
  const resources = getResourceFolders(pageSize > 14 ? 14 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 14,
      total: faker.random.number({ min: 50, max: 500 }),
      data: resources,
    },
  });
});

router.post('/tree', (req, res) => {
  const { path } = req.body;
  res.json({
    code: 200,
    result: {
      children: getChildTree(),
      path,
    },
  });
});

router.post('/tree/file', (req, res) => {
  res.json({
    code: 200,
    result: getFiles(),
  });
});

export default router;
