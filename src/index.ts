import cluster from 'cluster';
import os from 'os';
import app from './app';
import db from './models';
import config from './config/index';
import { Logger } from './utils/logger';

const PORT = config.port || 3000;
const numCPUs = os.cpus().length;
const env = config.nodeEnv || 'development';
const isProd = env === 'production';

async function startSingleProcess() {
  try {
    await db.sequelize.authenticate();
    Logger.info('Database connection established successfully.');

    if (!isProd) {
      // DEV ONLY: auto sync
      await db.sequelize.sync();
      Logger.info('Database synchronized successfully (dev).');
    }

    app.listen(PORT, () => {
      Logger.info(
        `Process ${process.pid} listening on http://localhost:${PORT} (env=${env})`
      );
    });
  } catch (error) {
    Logger.error('Error during server start:', error);
    process.exit(1);
  }
}

if (isProd && cluster.isPrimary) {
  Logger.info(`Primary process ${process.pid} is running (cluster mode)`);

  db.sequelize
    .authenticate()
    .then(() => {
      Logger.info('Database connection established successfully (primary).');

      // No sync in prod; use migrations instead.

      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }

      cluster.on('exit', (worker, code, signal) => {
        Logger.warn(`Worker ${worker.process.pid} exited (${signal || code})`);
        if (code !== 0) {
          Logger.info('Starting a new worker...');
          cluster.fork();
        }
      });
    })
    .catch((error) => {
      Logger.error('Error during database initialization (primary):', error);
      process.exit(1);
    });
} else {
  // dev OR cluster worker
  startSingleProcess();
}

export { env };
