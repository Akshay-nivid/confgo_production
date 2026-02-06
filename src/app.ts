/* eslint-disable no-console */
/**
 * Main application setup for Express server
 * Author: sarathavs
 */
import cluster from 'cluster';
import express, { Application } from 'express';
import applyMiddleware from './middleware'; // Centralized middleware
import { errorHandler } from './middleware/errorHandler';
import routes from './routes'; // Centralized routes
import session from 'express-session';
import { RedisStore } from 'connect-redis'; // Correctly import RedisStore
import config from './config';
import { Logger } from './utils/logger'; // Import your custom logger class
import { redisClient } from './scheduler/redis';
import { startScheduler } from './scheduler';
import dotenv from 'dotenv';

// Import Firebase configuration
import { firebaseAdmin } from './config/firebaseConfig';

const app: Application = express();
dotenv.config();
// Override console methods to route through Winston logger
console.log = (...args) => Logger.info(...args);
console.info = (...args) => Logger.info(...args);
console.warn = (...args) => Logger.warn(...args);
console.error = (...args) => Logger.error(...args);

// Initialize RedisStore
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:', // Optional prefix for session keys
});

// Session setup using Redis
app.use(
  session({
    store: redisStore,
    secret: config.sessionSecret, // Keep this secret in environment variables
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 20, // 20 days
    },
  })
);

// Apply middleware
applyMiddleware(app);

// Use centralized routes
app.use('/api', routes);

// Error handling middleware (this should be the last middleware)
app.use(errorHandler);

// Firebase Admin Initialization (Optional Logging)
if (firebaseAdmin) {
  console.info('Firebase Admin initialized successfully');
}

const startApp = () => {
  startScheduler();
};

// Only call startApp in primary process
if (!cluster.isWorker) {
  startApp();
}
export default app;
