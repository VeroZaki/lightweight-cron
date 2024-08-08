import { DEFAULT_QUEUE_NAME } from '../../../common/constants.js';
import logger from '../../../lib/winston.js';
import taskCreator from '../../cronEndpoints/service/taskCreator.js';
import TaskQueue from '../../queues/queue.js';

class TaskService {
  constructor(queueName = DEFAULT_QUEUE_NAME) {
    this.queue = new TaskQueue(queueName);
  }

  createTask(task) {
    return taskCreator.create(task);
  }

  clearTasks() {
    return this.queue.clearQueue();
  }

async removeJob(jobId) {
    try {
      logger.info(`Attempting to remove job with ID: ${jobId}`);
      const job = await this.queue.queue.getJob(jobId);
      if (job) {
        logger.info('Job found:', job);
        await job.remove();
        logger.info(`Job with ID: ${jobId} has been removed.`);
      } else {
        logger.info(`Job with ID: ${jobId} not found.`);
      }
    } catch (error) {
      console.error(`Error removing job with ID: ${jobId}`, error);
    }
  }
}

export default new TaskService();
