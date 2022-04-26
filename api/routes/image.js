import express from 'express';

import { img } from '../schema/image';

const router = express.Router();

router.get('/:id/:scale/:quality', (req, res) => {
  const { id } = req.params;
  res.json({
    code: 200,
    result: {
      id,
      image: img,
    },
  });
});

export default router;
