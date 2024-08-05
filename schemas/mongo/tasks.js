import mongoose from 'mongoose';
import shortid from 'shortid';
import { TASK_TYPES } from '../../common/constants.js';

const jobReference = new mongoose.Schema({
  jobId: {
    type: String,
  },
  queueName: {
    type: String,
  },
  repeatKeyRef: {
    type: String,
  },
}, { _id: false, timestamps: true });

const TaskSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  taskType: {
    type: String,
    validator: (v) => TASK_TYPES.includes(v),
    required: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
  },
  isExecutable: {
    type: Boolean,
    default: false,
  },
  taskProperties: {
    type: Object,
    default: {},
  },
  executionPath: {
    type: String,
    required: true,
  },
  taskParams: {
    type: Object,
    default: {},
  },
  isAsync: {
    type: Boolean,
    default: false,
  },
  executionLimitPerDay: {
    type: Number,
    default: 1,
  },
  jobReference: {
    type: jobReference,
  },
}, { collection: 'tasks', timestamps: true, strict: false });

const Tasks = mongoose.model('tasks', TaskSchema);

export default Tasks;
