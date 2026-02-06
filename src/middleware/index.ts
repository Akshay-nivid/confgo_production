/**
 * Middleware
 * Author: sarathavs
 */
import { Application } from 'express';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import config from '../config';
import { Logger } from '../utils/logger';

export default function applyMiddleware(app: Application) {
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allows cross-origin access to resources
    })
  );
  app.use(bodyParser.json()); // Parsing JSON requests
  app.use(morgan('dev')); // Logging HTTP requests
  // CORS configuration to allow any localhost port and subdomains of confgo.com
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);

        // Allow localhost on any port (both http and https)
        const localhostRegex = /^https?:\/\/localhost:\d+$/;
        
        // Allow 127.0.0.1 on any port (both http and https)
        const localhostIPRegex = /^https?:\/\/127\.0\.0\.1:\d+$/;

      const confgoSubdomainRegex = /^https?:\/\/([a-zA-Z0-9-]+\.)?confgo\.com$/;


        // Check if origin matches CLIENT_URL from config (if set)
        const clientUrl = config.clientUrl;
        const isClientUrl = clientUrl && origin === clientUrl;

        if (
          localhostRegex.test(origin) ||
          localhostIPRegex.test(origin) ||
          confgoSubdomainRegex.test(origin) ||
          isClientUrl
        ) {
          callback(null, true);
        } else {
          Logger.warn(`CORS blocked origin: ${origin}`);
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed methods including OPTIONS for preflight
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
      ],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      credentials: true,
      maxAge: 86400, // 24 hours - cache preflight requests
    })
  );
}
