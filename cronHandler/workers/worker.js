import _ from 'lodash';
import { Worker } from 'bullmq';
import { redis } from '../../common/config.js';
import {  DEFAULT_WORKER_NAME, DELIMITER, REDIS_DB, WORKER_TO_EXECUTER_MAP,} from './config/index.js';
import logger from '../../lib/winston.js';
import Tasks from '../../tasks/index.js';

class TaskWorker {
  constructor(queueName = DEFAULT_WORKER_NAME) {
    this.queueName = queueName;
  }

  create() {
    logger.info(`Creating worker for ${this.queueName}`);
    const selectedExecuter = this.workerExecuterFactory(this.queueName);
    if (!selectedExecuter) {
      logger.error(`Executor not found for ${this.queueName}`);
      return false;
    }

    return new Worker(this.queueName, selectedExecuter,
      {
        connection: {
          host: redis.host,
          port: redis.port,
          db: REDIS_DB,
        },
      });
  }

  workerExecuterFactory(queueName = 'DEFAULT') {
    const workerExecuters = {
      DEFAULT: this.workerExecuter.bind(this),
    };
    const executorName = WORKER_TO_EXECUTER_MAP[queueName];

    if (!Object.keys(workerExecuters).includes(executorName)) {
      logger.error(`Executor ${executorName} not found`);
      return false;
    }
    return workerExecuters[executorName];
  }

  async workerExecuter(job) {
    await job.updateProgress(42);
    logger.info(`Executing job ${job.id}`);
    const targetModule = _.get(job, 'data.targetModule', null);
    logger.info(`Executing job ${job.id} with targetModule ${targetModule}`);
    if (targetModule) {
      const isAsync = _.get(job, 'data.isAsync', false);
      const [taskName, executionMethod] = this._getTaskNameAndExecutionMethod(targetModule);
      (isAsync) ? await Tasks[taskName][executionMethod](job.data) : Tasks[taskName][executionMethod](job.data);
    }
  }

  _getTaskNameAndExecutionMethod(targetModule) {
    const [taskName, executionMethod] = targetModule.split(DELIMITER);
    return [taskName, executionMethod];
  }
}

export default TaskWorker;
