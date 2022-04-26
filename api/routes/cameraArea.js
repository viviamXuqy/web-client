import express from 'express';

import { camera } from '../schema/cameras';

const router = express.Router();

router.put('/:id', (req, res) => {
  res.json({
    code: 200,
    result: camera,
  });
});

export default router;
