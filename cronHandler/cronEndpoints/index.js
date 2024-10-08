import express from 'express';
import TaskController from './controller/index.js';

const Router = express.Router();

Router.post('/create',
    TaskController.createTask
);
Router.post('/clear', 
    TaskController.clearTasks
);
Router.put('/restart/:taskName', TaskController.restartTask);
Router.put('/stop/:taskName', TaskController.stopTask);
Router.post('/delete/:taskName', 
    TaskController.deleteTask
);
Router.post('/remove/:taskName', 
    TaskController.removeTask
);
Router.get('/list', 
    TaskController.listTasks
);
Router.put('/update/:taskName', 
    TaskController.updateTask
);


export default Router;
