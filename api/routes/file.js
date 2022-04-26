import express from 'express';

import { imageFeatures } from '../schema/features';

const router = express.Router();

router.post('/upload', (req, res) => {
  res.json({
    code: 200,
    result: { id: 0, name: 'test.mp4', path: '/test.mp4' },
  });
});

router.post('/struct', (req, res) => {
  const features = imageFeatures;

  res.json({
    code: 200,
    result: JSON.stringify(features),
  });
});

export default router;
