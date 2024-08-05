import _ from 'lodash';
import TaskService from '../service/index.js';

class TaskController {
  async createTask(req, res) {
    const response = await TaskService.createTask(req.body);
    if (!_.isNil(response)) {
      res.status(201).json({ success: true, message: 'Task created successfully' });
    } else {
      res.status(400).json();
    }
  }

  getTasks(req, res) {
    this.taskService.getTasks()
      .then((tasks) => {
        res.status(200).json(tasks);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  }

  restartTask(req, res) {
    return res.status(200).json({ success: true, message: 'Task restarted successfully' });
  }

  stopTask(req, res) {
    return res.status(200).json({ success: true, message: 'Task stopped successfully' });
  }

  deleteTask(req, res) {
    return res.status(200).json({ success: true, message: 'Task deleted successfully' });
  }

  removeTask(req, res) {
    return res.status(200).json({ success: true, message: 'Task removed successfully' });
  }

  listTasks(req, res) {
    return res.status(200).json({ success: true, message: 'Tasks listed successfully' });
  }

  async updateTask(req, res) {
    return res.status(200).json({ success: true, message: 'Tasks listed successfully' });
  }
}

export default new TaskController();
