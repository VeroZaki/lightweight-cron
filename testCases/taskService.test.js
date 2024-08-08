// import { expect } from 'chai';
// import sinon from 'sinon';
// import initiateMongoConnection from '../lib/mongoose.js';
// import TaskService from '../cronHandler/cronEndpoints/service/index.js';
// import Queue from '../cronHandler/queues/queue.js'; // Adjust the path accordingly

// describe('TaskService', function () {
//   let sandbox;
//   let queueStub;

//   beforeEach(() => {
//     initiateMongoConnection();
//     sandbox = sinon.createSandbox();
//     queueStub = sandbox.stub(Queue.prototype, 'addJob').resolves({ id: '123', taskName: 'Test Task' });
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   it('should create a new job', async function () {
//     const task = {
//       taskName: 'Test Task',
//       taskType: 'Cron',
//       taskDescription: 'A test task',
//       taskParams: { countryCode: 'US' },
//       executionPath: 'Task.run',
//       isExecutable: true,
//       cronExpr: '* * * * *',
//       isAsync: false
//     };

//     const result = await TaskService.createTask(task);
//     expect(result).to.have.property('id');
//     expect(result.taskName).to.equal('Test Task');
//   });
// });
