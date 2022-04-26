import express from 'express';

const router = express.Router();

router.post('/', (req, res) => {
  res.json({
    code: 200,
    result: 'success',
  });
});

export default router;
