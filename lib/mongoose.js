import mongoose from 'mongoose';

import { mongodb } from '../common/config.js';
import logger from './winston.js';

mongoose.set('strictQuery', false);
const connectionUrl = mongodb.uri;

const mongooseConnectionOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: false,
  connectTimeoutMS: 360000,
  socketTimeoutMS: 360000,
};

mongoose.connection.on('error', (err) => {
  logger.error(`mongoose connection error: ${err}`);
});
async function initiateConnection() {
  logger.info('[mongoose.js] Connected successfully to MongoDB server');
  return mongoose.connect(connectionUrl, mongooseConnectionOptions);
}

export default initiateConnection;
