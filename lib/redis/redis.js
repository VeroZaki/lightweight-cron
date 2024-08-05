import { instancesStatus, instances } from './instances.js';

import logger from '../winston.js';

class REDIS {
  constructor(dbNumber = 0) {
    this.dbNumber = dbNumber;
    this.client = {};
    this.redisStatus = { checkFirstConnections: false, isRedisUp: false };
    this.isConnected = false;
  }

  async connect() {
    try {
      this.redisStatus.checkFirstConnections = true;
      if (this.dbNumber < 16 && (await instancesStatus)[this.dbNumber] && !this.isConnected) {
        this.client = await instances[this.dbNumber];
        this.redisStatus.isRedisUp = true;
        logger.info(`[redis.js][connect] : connected to ${this.dbNumber}`);
        this.isConnected = true;
        return true;
      }
      logger.error(`[redis.js][connect] : can't connect to ${this.dbNumber}`);
      this.redisStatus.isRedisUp = false;
    } catch (error) {
      logger.error(`[redis.js][connect]: ${error}`);
    }
    return false;
  }

  async hset(DB, hashName, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    return this.client.hset(DB, hashName, value);
  }

  async set(hashName, value) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    }
    return this.client.set(hashName, value);
  }

  async get(hashName) {
    return this.client.get(hashName);
  }

  async hdel(DB, hashname) {
    return this.client.hdel(DB, hashname);
  }

  async hexists(DB, hashname) {
    return this.client.hexists(DB, hashname);
  }

  async hget(DB, hashName) {
    return this.client.hget(DB, hashName);
  }

  async hscan(DB, regex) {
    const maxCount = 999999999999999999;
    return this.client.hscan(DB, 0, 'MATCH', regex, 'COUNT', maxCount);
  }

  async keys(regex) {
    return this.client.keys(regex);
  }

  async del(hashName) {
    return this.client.del(hashName);
  }

  async hgetall(hashName) {
    return this.client.hgetall(hashName);
  }
}

export default REDIS;
