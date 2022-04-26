import express from 'express';
import faker from 'faker';
import { userInfo } from '../schema/system';


const router = express.Router();

router.get('/info', (req, res) => {
  debugger
  res.json({
    code: 200,
    result: { ...userInfo },
  });
});

router.post('/login', (req, res) => {
  res.json({
    code: 200,
    result: {
      token: faker.random.uuid(),
    },
  });
});
export default router;
