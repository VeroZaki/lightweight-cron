import taskCreator from '../../cronEndpoints/service/taskCreator.js';

class TaskService {
  constructor() {
  }

  createTask(task) {
    return taskCreator.create(task);
  }
}

export default new TaskService();
