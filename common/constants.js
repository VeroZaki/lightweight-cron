export const ARABIC_LANGUAGE_ISO_CODE = 'ar';
export const ENGLISH_LANGUAGE_ISO_CODE = 'en';
export const DEFAULT_QUEUE_NAME = 'TASK_QUEUE';
export const TASK_OPS_QUEUE_NAME = 'TASK_OPS_QUEUE';
export const ONE_TIME_TASK_TYPE = 'OneTime';
export const REPEATABLE_TASK_TYPE = 'Repeatable';
export const DELAYED_TASK_TYPE = 'Delayed';
export const PRIORITIZED_TASK_TYPE = 'Prioritized';
export const CRON_TASK_TYPE = 'Cron';
export const TASK_TYPES = [ONE_TIME_TASK_TYPE, REPEATABLE_TASK_TYPE, DELAYED_TASK_TYPE, PRIORITIZED_TASK_TYPE, CRON_TASK_TYPE];
export const TASK_TYPE_ENUM = {
  ONE_TIME: ONE_TIME_TASK_TYPE,
  REPEATABLE: REPEATABLE_TASK_TYPE,
  DELAYED: DELAYED_TASK_TYPE,
  PRIORITIZED: PRIORITIZED_TASK_TYPE,
  CRON: CRON_TASK_TYPE,
};
export const REPEATABLE_TYPES = [CRON_TASK_TYPE];
export const TASK_STATUS = ['Pending', 'Running', 'Completed', 'Failed'];

