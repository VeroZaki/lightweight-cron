import {
  TASKS_SCHEMA,
} from '../constants/index.js';

import Tasks from '../../schemas/mongo/tasks.js';

export default {
  [TASKS_SCHEMA]: Tasks,
};
