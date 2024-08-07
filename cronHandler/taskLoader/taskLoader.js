import _ from 'lodash';
import Tasks from '../../schemas/mongo/tasks.js';
import TaskQueue from '../queues/queue.js';
import ModelManager from '../../models/mongo/modelManager.js';
import { TASKS_SCHEMA } from '../../models/constants/index.js';
import taskExecutionChecker from './taskExecutionChecker.js';
import { REPEATABLE_TYPES } from '../../common/constants.js';
import logger from '../../lib/winston.js';

class TaskLoader {
  constructor() {
    this.queue = new TaskQueue();
    this.taskExecutionChecker = taskExecutionChecker;
  }

  async loadExecutableTasks() {
    try {
      const isTaskLoadable = await this.taskExecutionChecker.isTasksLoadedToday();
      const tasks = await Tasks.find({ isExecutable: true });
      logger.info(`Tasks to be loaded: ${tasks.length}`);

      for (const task of tasks) {
        const loadJob = await this.shouldLoadJob(task, isTaskLoadable);
        if (loadJob) {
          logger.info(`Loading task: ${task.taskName}`);
          const addedJob = await this.loadTask(task);
          if (REPEATABLE_TYPES.includes(task.taskType)) {
            await this.registerTask(task.taskName, addedJob);
          }
        }
      }

      await this.taskExecutionChecker.setTasksLoadedToday();
    } catch (err) {
      logger.error(`Error while loading tasks: ${err}`);
    }
  }

  async shouldLoadJob(task, isTaskLoadable) {
    if (REPEATABLE_TYPES.includes(task.taskType)) {
      const jobRef = _.get(task, 'jobReference', null);
      if (!_.isNil(jobRef)) {
        logger.info(`Job Reference: ${JSON.stringify(jobRef)}`);
        return !(await this.taskExecutionChecker.isRegistered(jobRef));
      }
      return true;
    }
    return !isTaskLoadable;
  }

  async loadTask(task) {
    const taskName = task.taskName.replace(/ /g, '');
    const addedJob = await this.queue.addJob(
      taskName,
      { ...task.taskParams, isAsync: task.isAsync, targetModule: task.executionPath },
      { ...task.taskProperties, removeOnComplete: true, jobId: taskName }
    );
    return addedJob;
  }

  async registerTask(taskName, task) {
    const jobReference = {
      jobId: task.id,
      repeatKeyRef: task.repeatJobKey,
      queueName: task.queue.name,
    };
    logger.info(`Registering task: ${taskName} with job reference: ${JSON.stringify(jobReference)}`);
    await ModelManager.use(TASKS_SCHEMA).updateMany({ taskName: taskName }, { jobReference });
  }
}

export default new TaskLoader();
