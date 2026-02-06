import Redis from 'ioredis';
import Redlock from 'redlock';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Create a Redis client using environment variables
const redisClient = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || '', // Optional password
});

// Log Redis connection status
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// Create a Redlock instance (stable version 4.x)
const redlock = new Redlock([redisClient as any], {
  retryCount: 0, // No retries to acquire lock
  retryDelay: 200, // Delay between retries
  retryJitter: 200, // Add jitter to avoid race conditions
});

// Export both redisClient and redlock
export { redisClient, redlock };
