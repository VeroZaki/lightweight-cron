import _ from 'lodash';
import TaskService from '../service/index.js';
import ModelManager from '../../../models/mongo/modelManager.js';
import { TASKS_SCHEMA } from '../../../models/constants/index.js';

class TaskController {
  async createTask(req, res) {
    const response = await TaskService.createTask(req.body);
    if (!_.isNil(response)) {
      res.status(201).json({ success: true, message: 'Task created successfully' });
    } else {
      res.status(400).json();
    }
  }

  async clearTasks(req, res) {
    await TaskService.clearTasks(req.body);
    res.status(200).json({ success: true, message: 'Task cleared successfully' });
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

  async stopTask(req, res) {
    const task = await ModelManager.use(TASKS_SCHEMA).findOne({ taskName: req.params.taskName });
    if (!task) {
      res.status(400).json({ message: 'Task is not found' });
    }
    await ModelManager.use(TASKS_SCHEMA).updateOne({_id: task._id}, { isExecutable: false });

    const jobId = task.jobReference.jobId;
    console.log('jobId:', jobId)
    await TaskService.removeJob(jobId);
    return res.status(200).json({ success: true, message: 'Task stopped successfully' });
  }

  async restartTask(req, res) {
    const task = await ModelManager.use(TASKS_SCHEMA).findOne({ taskName: req.params.taskName });
    if (!task) {
      res.status(400).json({ message: 'Task is not found' });
    }
    await ModelManager.use(TASKS_SCHEMA).updateOne({_id: task._id}, { isExecutable: true });
    return res.status(200).json({ success: true, message: 'Task restarted successfully' });
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
