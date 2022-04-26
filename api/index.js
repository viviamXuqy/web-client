import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import os from 'os';

import routes from './routes';

const FORKNUM = os.cpus().length > 1 ? 1 : os.cpus().length;
const customFork = customCluster => {
  customCluster.fork();
};

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`); // eslint-disable-line no-console

  for (let i = 0; i < FORKNUM; i++) {
    customFork(cluster);
  }

  cluster.on('exit', worker => {
    console.log(`worker ${worker.process.pid} died, restarting...`); // eslint-disable-line no-console
    customFork(cluster);
  });
} else {
  const app = express();

  app.use(cors());
  app.set('port', process.env.PORT || 3001);

  // Use application-level middleware for common functionality, including
  // logging, parsing, and session handling.
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
  app.use(bodyParser.json({ limit: '5mb' }));

  app.use(express.static('api/public'));
  // routes
  app.use('/api', routes);

  try {
    app.listen(app.get('port'), () => {
      console.log(`Worker ${process.pid} started, Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
    });
  } catch (error) {
    console.log(`listen port at ${app.get('port')} error`); // eslint-disable-line no-console
  }
}

