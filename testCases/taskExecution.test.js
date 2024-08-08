import { expect } from 'chai';
import sinon from 'sinon';
import taskLoaderInstance from '../cronHandler/taskLoader/taskLoader.js';
import Tasks from '../schemas/mongo/tasks.js';
import ModelManager from '../models/mongo/modelManager.js';
import { TASKS_SCHEMA } from '../models/constants/index.js';

describe('TaskLoader', () => {
  let taskLoader;
  let taskQueueStub;
  let taskExecutionCheckerStub;

  beforeEach(() => {
    sinon.restore();

    taskQueueStub = {
      addJob: sinon.stub(),
    };

    taskExecutionCheckerStub = {
      isTasksLoadedToday: sinon.stub(),
      setTasksLoadedToday: sinon.stub(),
      isRegistered: sinon.stub(),
    };

    taskLoader = taskLoaderInstance;
    taskLoader.queue = taskQueueStub;
    taskLoader.taskExecutionChecker = taskExecutionCheckerStub;
  });

  describe('loadExecutableTasks', () => {
    it('should load and register executable tasks', async () => {
      const tasks = [
        { taskName: 'Task1', taskType: 'repeatable', taskParams: {}, isAsync: false, executionPath: 'Task1.run' },
        { taskName: 'Task2', taskType: 'repeatable', taskParams: {}, isAsync: true, executionPath: 'Task2.run' },
      ];

      taskExecutionCheckerStub.isTasksLoadedToday.resolves(false);
      sinon.stub(Tasks, 'find').resolves(tasks);
      taskQueueStub.addJob.resolves({ id: 'job-id', queue: { name: 'queue-name' } });
      taskExecutionCheckerStub.setTasksLoadedToday.resolves();

      await taskLoader.loadExecutableTasks();

      expect(Tasks.find.calledOnce).to.be.true;
      expect(taskQueueStub.addJob.callCount).to.equal(2);
      expect(taskExecutionCheckerStub.setTasksLoadedToday.calledOnce).to.be.true;
    });

    it('should not load tasks if they are already loaded today', async () => {
      taskExecutionCheckerStub.isTasksLoadedToday.resolves(true);
      sinon.stub(Tasks, 'find').resolves([]);

      await taskLoader.loadExecutableTasks();

      expect(Tasks.find.calledOnce).to.be.true;
      expect(taskQueueStub.addJob.called).to.be.false;
    });

    it('should handle errors during task loading', async () => {
      taskExecutionCheckerStub.isTasksLoadedToday.resolves(false);
      sinon.stub(Tasks, 'find').rejects(new Error('Database error'));
      taskExecutionCheckerStub.setTasksLoadedToday.resolves();

      await taskLoader.loadExecutableTasks();

      expect(Tasks.find.calledOnce).to.be.true;
      expect(taskQueueStub.addJob.called).to.be.false;
    });
  });

  describe('shouldLoadJob', () => {
    it('should return true for repeatable tasks without job references', async () => {
      const task = { taskType: 'repeatable', jobReference: null };
      const result = await taskLoader.shouldLoadJob(task, false);
      expect(result).to.be.true;
    });

    it('should return false for tasks already loaded today', async () => {
      const task = { taskType: 'repeatable', jobReference: { jobId: 'job-id', queueName: 'queue-name' } };
      taskExecutionCheckerStub.isRegistered.resolves(true);
      const result = await taskLoader.shouldLoadJob(task, true);
      expect(result).to.be.false;
    });

    it('should return true for non-repeatable tasks', async () => {
      const task = { taskType: 'non-repeatable', jobReference: null };
      const result = await taskLoader.shouldLoadJob(task, false);
      expect(result).to.be.true;
    });

    it('should return false for repeatable tasks with job references when not registered', async () => {
      const task = { taskType: 'repeatable', jobReference: { jobId: 'job-id', queueName: 'queue-name' } };
      taskExecutionCheckerStub.isRegistered.resolves(false);
      const result = await taskLoader.shouldLoadJob(task, true);
      expect(result).to.be.false;
    });

    it('should return false for non-repeatable tasks when isTaskLoadable is true', async () => {
      const task = { taskType: 'non-repeatable', jobReference: null };
      const result = await taskLoader.shouldLoadJob(task, true);
      expect(result).to.be.false;
    });

    it('should return false for repeatable tasks with job references when registered', async () => {
      const task = { taskType: 'repeatable', jobReference: { jobId: 'job-id', queueName: 'queue-name' } };
      taskExecutionCheckerStub.isRegistered.resolves(true);
      const result = await taskLoader.shouldLoadJob(task, true);
      expect(result).to.be.false;
    });
  });

  describe('loadTask', () => {
    it('should add a task to the queue with correct parameters', async () => {
      const task = { taskName: 'Task1', taskParams: {}, isAsync: false, executionPath: 'Task1.run', taskProperties: {} };
      taskQueueStub.addJob.resolves({ id: 'job-id', queue: { name: 'queue-name' } });

      const addedJob = await taskLoader.loadTask(task);

      expect(taskQueueStub.addJob.calledWith(
        task.taskName.replace(/ /g, ''),
        { ...task.taskParams, isAsync: task.isAsync, targetModule: task.executionPath },
        { ...task.taskProperties, removeOnComplete: true, jobId: task.taskName }
      )).to.be.true;
      expect(addedJob).to.deep.equal({ id: 'job-id', queue: { name: 'queue-name' } });
    });

    it('should handle errors when adding a task to the queue', async () => {
      const task = { taskName: 'Task1', taskParams: {}, isAsync: false, executionPath: 'Task1.run', taskProperties: {} };
      taskQueueStub.addJob.rejects(new Error('Queue error'));

      try {
        await taskLoader.loadTask(task);
      } catch (err) {
        expect(err.message).to.equal('Queue error');
        expect(taskQueueStub.addJob.calledOnce).to.be.true;
      }
    });
  });

  describe('registerTask', () => {
    it('should register a task with job reference', async () => {
      const task = { id: 'job-id', repeatJobKey: 'repeat-key', queue: { name: 'queue-name' } };
      const taskName = 'Task1';
      const updateManyStub = sinon.stub(ModelManager.use(TASKS_SCHEMA), 'updateMany').resolves();

      await taskLoader.registerTask(taskName, task);

      expect(updateManyStub.calledWith(
        { taskName: taskName },
        { jobReference: { jobId: task.id, repeatKeyRef: task.repeatJobKey, queueName: task.queue.name } }
      )).to.be.true;
    });

    it('should handle errors during task registration', async () => {
      const task = { id: 'job-id', repeatJobKey: 'repeat-key', queue: { name: 'queue-name' } };
      const taskName = 'Task1';
      const updateManyStub = sinon.stub(ModelManager.use(TASKS_SCHEMA), 'updateMany').rejects(new Error('Update error'));

      try {
        await taskLoader.registerTask(taskName, task);
      } catch (err) {
        expect(err.message).to.equal('Update error');
        expect(updateManyStub.calledOnce).to.be.true;
      }
    });
  });
});
