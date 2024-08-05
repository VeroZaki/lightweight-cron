import express from 'express';
import bodyParser from 'body-parser';
import logger from '../lib/winston.js';

import TaskRoutes from '../cronHandler/cronEndpoints/index.js';

const initializeApp = () => {
  const app = express();
  const PORT = process.env.PORT || 8080;
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use('/task', TaskRoutes);
  return app.listen(PORT, () => logger.info(`Server is running on port ${PORT}`));
};

export default initializeApp;
