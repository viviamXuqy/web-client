import express from 'express';
import SseStream from 'ssestream'; // eslint-disable-line
import moment from 'moment'; // eslint-disable-line
import faker from 'faker';
import { getMonitorData, getAnalysis } from '../schema/smartApp';
import { reviewPlateResult, reviewPlateStatistics, videoProgress } from '../schema/reviewPlates';

const router = express.Router();

router.get('/register/monitor/:id', (req, res) => {
  const { id } = req.params;
  console.log(`client[${id}] connect to server`); // eslint-disable-line no-console

  const sseStream = new SseStream(req);

  sseStream.pipe(res);
  const pusher = setInterval(() => {
    sseStream.write({
      event: 'monitorData',
      id,
      data: {
        ...getMonitorData,
        taskId: id.split('-')[0],
        time: moment(faker.date.recent()).valueOf(),
      },
    });
    sseStream.write({
      event: 'monitorAnalysis',
      id,
      data: {
        ...getAnalysis,
        taskId: id.split('-')[0],
        time: moment(faker.date.recent()).valueOf(),
      },
    });
  }, 1000 * 5);

  res.on('close', () => {
    console.log(`monitor client[${id}] disconnect to server`); // eslint-disable-line no-console
    clearInterval(pusher);
    sseStream.unpipe(res);
  });
});

router.get('/register/review/:id', (req, res) => {
  const { id } = req.params;
  console.log(`review client[${id}] connect to server`); // eslint-disable-line no-console

  const sseStream = new SseStream(req);
  let index = 0;

  sseStream.pipe(res);
  const pusher = setInterval(() => {
    index++;
    sseStream.write({
      event: 'reviewPlateResult',
      id,
      data: {
        ...reviewPlateResult,
        plateCheckedTime: moment(faker.date.recent()).format('HH:mm:ss'),
        taskId: id.split('-')[0],
      },
    });
    sseStream.write({
      event: 'reviewPlateStatistics',
      id,
      data: {
        ...reviewPlateStatistics,
        vehicleNums: faker.random.number({ min: 0, max: 999 }),
        taskId: id.split('-')[0],
      },
    });
    if (index === 20) {
      sseStream.write({
        event: 'videoProgress',
        id,
        data: {
          ...videoProgress,
          taskId: id.split('-')[0],
        },
      });
    }
  }, 1000 * 5);

  res.on('close', () => {
    console.log(`client[${id}] disconnect to server`); // eslint-disable-line no-console
    clearInterval(pusher);
    sseStream.unpipe(res);
  });
});

export default router;
