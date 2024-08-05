import { TASK_TYPES, TASK_TYPE_ENUM } from '../../../common/constants.js';

export default class TaskBuilder {
  constructor() {
    this.task = {};
  }

  setTaskType(taskType) {
    if (TASK_TYPES.includes(taskType)) {
      this.task.taskType = taskType;
    }
    return this;
  }

  setTaskName(taskName) {
    this.task.taskName = taskName;
    return this;
  }

  setTaskDescription(taskDescription) {
    this.task.taskDescription = taskDescription;
    return this;
  }

  setTaskParams(taskParams) {
    this.task.taskParams = taskParams;
    return this;
  }

  setExecutionPath(executionPath) {
    this.task.executionPath = executionPath;
    return this;
  }

  setIsExecutable(isExecutable) {
    this.task.isExecutable = isExecutable;
    return this;
  }

  setRepeatEvery(repeatEvery, limit) {
    this.task.taskProperties = {};
    this.task.taskProperties.repeat = {};
    this.task.taskProperties.repeat.every = repeatEvery;
    this.task.taskProperties.repeat.limit = limit;
    this.task.taskType = TASK_TYPE_ENUM.REPEATABLE;
    return this;
  }

  setCronExpression(cronExpression) {
    this.task.taskProperties = {};
    this.task.taskProperties.repeat = {};
    this.task.taskProperties.repeat.pattern = cronExpression;
    this.task.taskType = TASK_TYPE_ENUM.CRON;
    return this;
  }

  setPriority(priority) {
    this.task.TaskProperties = {};
    this.task.TaskProperties.priority = priority;
    this.task.TaskType = TASK_TYPE_ENUM.PRIORITIZED;
    return this;
  }

  setDelay(delay) {
    this.task.TaskProperties = {};
    this.task.TaskProperties.delay = delay;
    this.task.TaskType = TASK_TYPE_ENUM.DELAYED;
    return this;
  }

  _isValid() {
    return (
      !TASK_TYPES.includes(this.task.taskType)
      || !this.task.taskName
      || !this.task.executionPath
    );
  }

  settingLookup(propName) {
    const mapper = {
      TaskName: this.setTaskName,
      TaskType: this.setTaskType,
      TaskDescription: this.setTaskDescription,
      TaskParams: this.setTaskParams,
      executionPath: this.setExecutionPath,
      isExecutable: this.setIsExecutable,
      cronExpr: this.setCronExpression,
      repeatEvery: this.setRepeatEvery,
      delay: this.setDelay,
      priority: this.setPriority,
    };
    return mapper[propName].bind(this);
  }

  build(runValidation = true) {
    if (!runValidation) {
      return this.task;
    }
    return (!this._isValid()) ? this.task : null;
  }
}
