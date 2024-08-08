import _ from 'lodash';
import Task from '../../../schemas/mongo/tasks.js';
import logger from '../../../lib/winston.js';
import TaskBuilder from './taskBuilder.js';

class TaskCreator {
  async create(TaskProperties) {
    const taskName = _.get(TaskProperties, 'taskName', null);
    const taskType = _.get(TaskProperties, 'taskType', null);
    const taskDescription = _.get(TaskProperties, 'taskDescription', null);
    const taskParams = _.get(TaskProperties, 'taskParams', {});
    const executionPath = _.get(TaskProperties, 'executionPath', null);
    const isExecutable = _.get(TaskProperties, 'isExecutable', false);
    const cronExpr = _.get(TaskProperties, 'cronExpr', null);
    const repeatEvery = _.get(TaskProperties, 'repeatEvery', null);
    const delay = _.get(TaskProperties, 'delay', null);
    const priority = _.get(TaskProperties, 'priority', null);

    if (executionPath === null || taskName === null) {
      logger.error('TaskName and executionPath are required');
      return null;
    }

    if (await this.checkIfTaskExists(taskName)) {
      logger.error(`Task with name ${taskName} already exists`);
      return { error: `Task with name ${taskName} already exists` };
    }
    const taskBuilder = new TaskBuilder();
    taskBuilder.setTaskName(taskName)
      .setTaskType(taskType)
      .setTaskDescription(taskDescription)
      .setTaskParams(taskParams)
      .setExecutionPath(executionPath)
      .setIsExecutable(isExecutable);
    if (!_.isNil(cronExpr)) {
      taskBuilder.setCronExpression(cronExpr);
    }
    if (!_.isNil(repeatEvery)) {
      taskBuilder.setRepeatEvery(repeatEvery.every, repeatEvery.limit);
    }
    if (!_.isNil(delay)) {
      taskBuilder.setDelay(delay);
    }
    if (!_.isNil(priority)) {
      taskBuilder.setPriority(priority);
    }

    if (!_.isNil(taskBuilder.build())) {
      logger.info(`Creating task with name ${taskBuilder.task}`);
      const task = await Task.create(taskBuilder.task);
      return task;
    }
    return { error: 'Task could not be created' };
  }

  async update(_id, TaskProperties) {
    const taskBuilder = new TaskBuilder();
    Object.keys(TaskProperties).forEach((key) => {
      taskBuilder.settingLookup(key)(TaskProperties[key]);
    });
    const newParams = taskBuilder.build(false);
    const updatedTask = await Task.findOneAndUpdate({ _id }, { $set: newParams }, { new: true });
    return updatedTask;
  }

  async checkIfTaskExists(taskName) {
    const task = await Task.findOne({ taskName: taskName });
    return (!_.isNil(task));
  }
}

export default new TaskCreator();
