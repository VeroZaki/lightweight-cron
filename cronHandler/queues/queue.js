import _ from 'lodash';
import { Queue } from 'bullmq';
import { DEFAULT_QUEUE_NAME } from '../../common/constants.js';
import { redis } from '../../common/config.js';

import { REDIS_DB } from './config/index.js';

export default class TaskQueue {
  constructor(queueName = DEFAULT_QUEUE_NAME, dbNumber = REDIS_DB) {
    this.queueName = queueName;
    this.queue = new Queue(this.queueName, {
      connection: {
        host: redis.host,
        port: redis.port,
        db: dbNumber,
      },
    });
  }

  async addJob(jobName, jobData, options = { delay: 1 }) {
    return this.queue.add(jobName, jobData, { ...options, removeOnComplete: true });
  }

  async clearQueue() {
    return this.queue.drain();
  }
}
