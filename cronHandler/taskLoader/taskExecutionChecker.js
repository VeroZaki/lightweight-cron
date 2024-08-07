import _ from 'lodash';
import RedisConnection from '../../lib/redis/redis.js';
import { redisInstDBNumber, HASH_CHECKER_NAME } from './config/constants.js';
import dateUtils from '../../utils/dateUtils.js';
import logger from '../../lib/winston.js';

const Redis = new RedisConnection(redisInstDBNumber);

class TaskExecutionChecker {
  constructor() {
    this.HASH_CHECKER_NAME = HASH_CHECKER_NAME;
  }

  async isRegistered(jobReference) {
    try {
      await this._checkConnection();
      const { jobId, queueName } = jobReference;
      const jobHash = `bull:${queueName}:${jobId}`;
      const jobPayload = await Redis.hget(jobHash, 'name');
      logger.info(`Job Payload: ${jobPayload}`, jobHash);
      return (!_.isNil(jobPayload));
    } catch (err) {
      logger.error(`Error while checking if job is registered: ${err}`);
    }
    return false;
  }

  async _checkConnection() {
    if (_.isEmpty(Redis.client)) {
      const isConnected = await Redis.connect();
      return isConnected;
    }
    return true;
  }

  async isTasksLoadedToday() {
    await this._checkConnection();
    const taskPayload = await Redis.get(this._constructHashKey());
    return !(_.isNil(taskPayload) || taskPayload == 0);
  }

  async setTasksLoadedToday() {
    await this._checkConnection();
    await Redis.set(this._constructHashKey(), '1');
  }

  async resetTasksLoadedToday() {
    await this._checkConnection();
    await Redis.set(this._constructHashKey(), '0');
  }

  _constructHashKey() {
    return `${this.HASH_CHECKER_NAME}:${dateUtils.getToday()}`;
  }
}

export default new TaskExecutionChecker();
