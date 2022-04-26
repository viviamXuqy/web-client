import { schema } from 'normalizr';

// We use this Normalizr schemas to transform API responses from a nested form
// Read more about Normalizr: https://github.com/paularmstrong/normalizr

export const resultSchema = new schema.Entity('results', {}, {
  idAttribute: result => `${result.id}`, // 识别结果
});

export const bayonetSchema = new schema.Entity('bayonets', {}, {
  idAttribute: bayonet => `${bayonet.id}`, // 卡口
});

export const cameraSchema = new schema.Entity('cameras', {}, {
  idAttribute: camera => `${camera.id}`, // 设备
});

export const taskSchema = new schema.Entity('tasks', {}, {
  idAttribute: task => `${task.id}`, // 任务
});

export const taskResultSchema = new schema.Entity('taskresults', {}, {
  idAttribute: taskresult => `${taskresult.id}`, // 任务总结果
});

export const sdkSchema = new schema.Entity('sdks', {}, {
  idAttribute: sdk => `${sdk.id}`, // 系统设置
});

export const logSchema = new schema.Entity('logs', {}, {
  idAttribute: log => `${log.id}`, // 日志
});

export const nvrSchema = new schema.Entity('nvrs', {}, {
  idAttribute: nvr => `${nvr.id}`, // NVR
});

export const userSchema = new schema.Entity('users', {}, {
  idAttribute: user => `${user.id}`, // 用户
});

export const vehicleTaskSchema = new schema.Entity('vehicleTasks', {}, {
  idAttribute: vehicleTasks => `${vehicleTasks.id}`, // 机动车任务
});
export const vehicleResultSchema = new schema.Entity('vehicleResults', {}, {
  idAttribute: vehicleResult => `${vehicleResult.id}`, // 机动车结果
});

export const violationTaskSchema = new schema.Entity('violationTasks', {}, {
  idAttribute: violationTask => `${violationTask.id}`, // 违章任务
});

export const violationResultSchema = new schema.Entity('violationResults', {}, {
  idAttribute: violationResult => `${violationResult.id}`, // 违章结果
});

export const reviewPlateTaskSchema = new schema.Entity('reviewPlateTasks', {}, {
  idAttribute: reviewPlateTask => `${reviewPlateTask.id}`, // 复审车牌任务
});

export const reviewPlateResultSchema = new schema.Entity('reviewPlateResults', {}, {
  idAttribute: reviewPlateResult => `${reviewPlateResult.id}`, // 复审车牌结果
});

// Schemas for API responses.
export const Schemas = {
  RESULT: resultSchema,
  RESULT_ARRAY: [resultSchema],
  BAYONET: bayonetSchema,
  BAYONET_ARRAY: [bayonetSchema],
  CAMERA: cameraSchema,
  CAMERA_ARRAY: [cameraSchema],
  TASK: taskSchema,
  TASK_ARRAY: [taskSchema],
  SDK: sdkSchema,
  SDK_ARRAY: [sdkSchema],
  TASKRESULT: taskResultSchema,
  TASKRESULT_ARRAY: [taskResultSchema],
  LOG: logSchema,
  LOG_ARRAY: [logSchema],
  NVR: nvrSchema,
  NVR_ARRAY: [nvrSchema],
  USER_ARRAY: [userSchema],
  VEHICLE_TASK: vehicleTaskSchema,
  VEHICLE_TASK_ARRAY: [vehicleTaskSchema],
  VEHICLE_RESULT: vehicleResultSchema,
  VEHICLE_RESULT_ARRAY: [vehicleResultSchema],
  VIOLATION_TASK: violationTaskSchema,
  VIOLATION_TASK_ARRAY: [violationTaskSchema],
  VIOLATION_RESULT: violationResultSchema,
  VIOLATION_RESULT_ARRAY: [violationResultSchema],
  REVIEW_PLATE_TASK: reviewPlateTaskSchema,
  REVIEW_PLATE_TASK_ARRAY: [reviewPlateTaskSchema],
  REVIEW_PLATE_RESULT: reviewPlateResultSchema,
  REVIEW_PLATE_RESULT_ARRAY: [reviewPlateResultSchema],
};
