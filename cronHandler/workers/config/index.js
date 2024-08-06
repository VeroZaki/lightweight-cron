import { DEFAULT_QUEUE_NAME, TASK_OPS_QUEUE_NAME } from '../../../common/constants.js';

export const DEFAULT_WORKER_NAME = DEFAULT_QUEUE_NAME;
export const WORKER_LISTENERS = [DEFAULT_QUEUE_NAME];
export const WORKER_TO_EXECUTER_MAP = {
  [DEFAULT_QUEUE_NAME]: 'DEFAULT',
  // [TASK_OPS_QUEUE_NAME]: 'QUEUE_OPS',
};
export const DELIMITER = '.';
export const REDIS_DB = 10;
