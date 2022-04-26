import express from 'express';
import faker from 'faker';

import { getCameras, camera, getSdkCameras } from '../schema/cameras';
import { img } from '../schema/image';

const router = express.Router();

router.get('/page', (req, res) => {
  const { page = 1, pageSize = 14 } = req.query;
  const cameras = getCameras(pageSize > 14 ? 14 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 14,
      total: faker.random.number({ min: 50, max: 500 }),
      data: cameras,
    },
  });
});

router.get('/:_id', (req, res) => {
  res.json({
    code: 200,
    result: camera,
  });
});

router.get('/bcpage/:id', (req, res) => {
  const { page = 1, pageSize = 4 } = req.query;
  const cameras = getCameras(pageSize > 5 ? 5 : +pageSize);

  res.json({
    code: 200,
    result: {
      page: +page || 1,
      pageSize: +pageSize || 4,
      total: faker.random.number({ min: 50, max: 500 }),
      data: cameras,
    },
  });
});

router.get('/bcSdk/:id', (req, res) => {
  const cameras = getSdkCameras(20);

  res.json({
    code: 200,
    result: cameras,
  });
});

router.post('/bcSdk', (req, res) => {
  const cameras = getSdkCameras(20);

  res.json({
    code: 200,
    result: cameras,
  });
});

router.get('/preview/:id/:quality', (req, res) => {
  res.json({
    code: 200,
    result: img,
  });
});

router.post('/', (req, res) => {
  res.json({
    code: 200,
    result: camera,
  });
});

router.delete('/:ids', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

router.post('/uploadCamera', (req, res) => {
  const { ...file } = req.body;

  res.json({
    result: {
      id: faker.random.uuid(),
      ...file,
    },
  });
});

router.put('/name/:id', (req, res) => {
  res.json({
    code: 200,
    result: camera,
  });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  res.json({
    code: 200,
    result: {
      ...camera,
      _id: id,
      area: [],
    },
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
router.post('/state', (req, res) => {
  const { states } = req.body;
  const result = states.map(item => ({
    _id: item.id,
    state: item.state.toString() === '1' ? 0 : 1,
  }
  ));
  res.json({
    code: 200,
    result,
  });
});
router.get('/tasknum/:id', (req, res) => {
  res.json({
    code: 200,
    result: 10,
  });
});
export default router;
