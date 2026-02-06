import dotenv from 'dotenv';
import type { SignOptions, Secret } from 'jsonwebtoken';

dotenv.config();

type ExpiresIn = SignOptions['expiresIn'];

interface JwtConfig {
  secret: Secret;
  expire: ExpiresIn;
  refreshSecret: Secret;
  refreshExpire: ExpiresIn;
}

const jwtConfig: JwtConfig = {
  secret: (process.env.JWT_SECRET || '1234567890abcdefg') as Secret,
  expire: (process.env.JWT_EXPIRE || '1h') as ExpiresIn,
  refreshSecret: (process.env.JWT_REFRESH_SECRET || '1234567890abcdefgh') as Secret,
  refreshExpire: (process.env.JWT_REFRESH_EXPIRE || '30d') as ExpiresIn,
};

export default {
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  jwt: jwtConfig,
  logLevel: process.env.LOG_LEVEL,
  sessionSecret: process.env.SESSION_SECRET || 'abcd123456789',
  redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
};
