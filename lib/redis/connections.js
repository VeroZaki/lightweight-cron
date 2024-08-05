import { redis } from '../../common/config.js';

export const defaultRedisCredentials = {
  hostName: redis.host,
  port: redis.port,
};

export const redisUris = {};

Array.from(Array(16).keys()).forEach((dbNumber) => {
  redisUris[dbNumber] = { host: defaultRedisCredentials.hostName, port: 6379, db: dbNumber };
});
