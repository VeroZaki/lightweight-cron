import Redis from 'ioredis';
import { redisUris } from './connections.js';
import logger from '../winston.js';

export const instances = {};
export const instancesStatus = Promise.all(Object.values(redisUris).map((reidsUri, idx) => new Promise(
  (resolve, reject) => {
    const redisInstance = new Redis(reidsUri);
    redisInstance.on('connect', () => {
      instances[idx] = redisInstance;

      redisInstance.set('start_redis_on_tasks', `Redis is now working fine! ${new Date().toISOString()}`);
      resolve(true);
    });
    redisInstance.on('error', (err) => {
      logger.error(`[redis.js] Redis connection error to DB No. ${idx} ${err.message}!`);
      instances[idx] = false;
      reject(err.message);
    });
  },
)));
