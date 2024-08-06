import TaskWorker from './worker.js';
import { WORKER_LISTENERS } from './config/index.js';
import logger from '../../lib/winston.js';

class WorkerManager {
  constructor() {
    this.workers = {};
  }

  async start() {
    WORKER_LISTENERS.map((queueName) => {
      logger.info(`Starting workers => ${queueName}`);
      this.workers[queueName] = new TaskWorker(queueName);
      this.workers[queueName].create();
      return true;
    });
  }
}

export default new WorkerManager();
