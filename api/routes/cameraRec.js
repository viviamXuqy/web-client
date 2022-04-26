import express from 'express';

import { camera } from '../schema/cameras';

const router = express.Router();

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  res.json({
    code: 200,
    result: {
      ...camera,
      _id: id,
      state: status.toString() === '0' ? 1 : 0,
    },
  });
});

router.put('/', (req, res) => {
  const { states } = req.body;

  if (!states) {
    return res.status(422).send({
      result: 'missing states parameter',
    });
  }

  return res.json({
    code: 200,
    result: states,
  });
});

export default router;
