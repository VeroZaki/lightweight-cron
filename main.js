import initializeApp from './express/index.js';
import initiateMongoConnection from './lib/mongoose.js';
import WorkerManager from './cronHandler/workers/workerManager.js'
import TaskLoader from './cronHandler/taskLoader/taskLoader.js';

(async () => {
  await initiateMongoConnection();
  initializeApp();
  await WorkerManager.start();
  await TaskLoader.loadExecutableTasks()
})();
