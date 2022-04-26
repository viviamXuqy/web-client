import express from 'express';

import results from './results';
import cameras from './cameras';
import image from './image';
import tasks from './tasks';
import cameraArea from './cameraArea';
import cameraRec from './cameraRec';
import bayonets from './bayonets';
import features from './feature';
import cameraFlush from './cameraFlush';
import resources from './resources';
import file from './file';
import system from './system';
import nvr from './nvr';
import auth from './auth';
import smartApp from './smartApp';
import sse from './sse';
import reviewPlate from './reviewPlate';

const router = express.Router();

router.use((req, res, next) => {
  /*if (
    req.path !== '/auth/login' && !req.headers.token
  ) {
    return res.status(401).send({
      code: 401,
      result: 'App.error.NotLogin',
    });
  }*/

  return next();
});

router.use('/image', image);
router.use('/result', results);
router.use('/camera', cameras);
router.use('/task', tasks);
router.use('/bayonet', bayonets);
router.use('/feature', features);
router.use('/cameraArea', cameraArea);
router.use('/cameraRec', cameraRec);
router.use('/cameraFlush', cameraFlush);
router.use('/resource', resources);
router.use('/file', file);
router.use('/system', system);
router.use('/nvr', nvr);
router.use('/auth', auth);
router.use('/app', smartApp);
router.use('/sse', sse);
router.use('/review', reviewPlate);

export default router;
