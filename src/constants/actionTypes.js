// user
export const FETCH_USER = 'FETCH_USER';
export const SIGNIN = 'SIGNIN'; // login
export const UPDATE_USER = 'UPDATE_USER';

// image
export const GET_IMG = 'GET_IMG'; // server端通用获取图片

// results 识别结果
export const FETCH_RESULTS = 'FETCH_RESULTS'; // 识别结果list
export const FETCH_RESULT = 'FETCH_RESULT'; // 识别结果详情
export const SUBMIT_RESULT = 'SUBMIT_RESULT';
export const DELETE_RESULT = 'DELETE_RESULT'; // 删除识别结果
export const UPLOAD_RESULT_FEATURE = 'UPLOAD_RESULT_FEATURE'; // 以图搜图: 上传图片识别出结构化信息
export const DELETE_RESULT_ALL = 'DELETE_RESULT_ALL'; // 删除全部识别结果

// tasks 任务结果
export const FETCH_TASKS = 'FETCH_TASKS'; // 任务列表
export const SUBMIT_TASK = 'SUBMIT_TASK'; // 添加任务
export const DELETE_TASK = 'DELETE_TASK'; // 删除任务
export const UPDATE_TASK_STATUS = 'UPDATE_TASK_STATUS'; // 开关状态
export const UPDATE_TASK_STATUS_LOT = 'UPDATE_TASK_STATUS_LOT'; // 批量开关状态
export const DELETE_TASK_ALL = 'DELETE_TASK_ALL'; // 删除全部任务
export const SET_TASK = 'SET_TASK'; // 任务设置
export const GET_TASK_NUM = 'GET_TASK_NUM'; // 实时(开启/总数）

// 任务总结果列表
export const FETCH_TASKRESULTS = 'FETCH_TASKRESULTS'; // 任务总结果列表list
export const DELETE_TASKRESULTS = 'DELETE_TASKRESULTS'; // 删除任务总结果

// cameras 设备管理
export const FETCH_CAMERAS = 'FETCH_CAMERAS'; // 设备list
export const FETCH_CAMERA = 'FETCH_CAMERA'; // 设备Camera
export const ADD_CAMERA = 'ADD_CAMERA'; // 添加Camera
export const DELETE_CAMERA = 'DELETE_CAMERA'; // 删除设备
export const UPDATE_CAMERA_STATUS = 'UPDATE_CAMERA_STATUS';
export const UPDATE_CAMERA_AREA = 'UPDATE_CAMERA_AREA'; // 更新设置摄像头区域
export const UPDATE_CAMERA_REC = 'UPDATE_CAMERA_REC'; // 摄像头监控开关
export const UPDATE_CAMERA_RECS = 'UPDATE_CAMERA_RECS'; // 摄像头监控开关s
export const GET_CAMERA_IMG = 'GET_CAMERA_IMG'; // 摄像头显示图
export const GET_CAMERA_NUM = 'GET_CAMERA_NUM'; // 摄像头(开启/总数）
export const RENAME_CAMERA = 'RENAME_CAMERA'; // 重命名摄像头
export const UPLOAD_EXCEL_FILE = 'UPLOAD_EXCEL_FILE'; // 上传批量刷新摄像头列表
export const GET_CAMERA_TASK_NUM = 'GET_CAMERA_TASK_NUM'; // 获取到摄像头关联的任务
// Nvr
export const FETCH_NVRS = 'FETCH_NVRS'; // NVRlist
export const ADD_NVR = 'ADD_NVR'; // 添加NVR
export const MODIFY_NVR = 'MODIFY_NVR'; // 修改NVR
export const DELETE_NVR = 'DELETE_NVR'; // 删除NVR

// 卡口
export const FETCH_BAYONETS = 'FETCH_BAYONETS'; // 卡口列表
export const FETCH_BAYONET_CAMERAS = 'FETCH_BAYONET_CAMERAS'; // 卡口下摄像头列表
export const FETCH_BAYONET_SDK_CAMERAS = 'FETCH_BAYONET_SDK_CAMERAS'; // 卡口下SDK摄像头列表
export const SUBMIT_BAYONET = 'SUBMIT_BAYONET'; // 添加卡口
export const SUBMIT_BAYONET_SDK = 'SUBMIT_BAYONET_SDK'; // 添加卡口独立
export const DELETE_BAYONET = 'DELETE_BAYONET'; // 删除卡口
export const RESET_BAYONET_NAME = 'RESET_BAYONET_NAME'; // 重命名卡口

// 视频/图片源
export const FETCH_RESOURCES = 'FETCH_RESOURCES'; // 源列表
export const FETCH_RESOURCE_TREE = 'FETCH_RESOURCE_TREE'; // 源下树列表
export const FETCH_RESOURCE_TREE_FILE = 'FETCH_RESOURCE_TREE_FILE'; // 源下文件列表
export const UPLOAD_FILE = 'UPLOAD_FILE'; // 上传文件

// 结构化数据
export const FETCH_FEATURES = 'FETCH_FEATURES'; // 拿到所有结构化数据

// filter
export const UPDATE_FILTER = 'UPDATE_FILTER'; // 检索条件过滤


// clear data
export const CLEAR_DATAS = 'CLEAR_DATAS'; // 清除store中相应的数据

// error message
export const SHOW_ERROR_MESSAGE = 'SHOW_ERROR_MESSAGE';
export const HIDE_ERROR_MESSAGE = 'HIDE_ERROR_MESSAGE';

// loading
export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';

// 系统设置
export const FETCH_SDKS = 'FETCH_SDKS'; // sdk传输协议列表
export const ADD_SDK = 'ADD_SDK'; // 添加协议
export const DELETE_SDK = 'DELETE_SDK'; // 删除任务
export const UPDATE_SDK_STATUS = 'UPDATE_SDK_STATUS'; // 开关状态
export const MODIFY_SDK = 'MODIFY_SDK'; // 修改协议
export const MODIFY_WORK_MODE = 'MODIFY_WORK_MODE'; // 修改工作配置
export const RECOVER_CONFIG = 'RECOVER_CONFIG'; // 恢复系统配置
export const SAVE_NTP = 'SAVE_NTP'; // 保存Ntp校时
export const SAVE_MANUAL = 'SAVE_MANUAL'; // 保存手动校时
export const FETCH_LOGS = 'FETCH_LOGS'; // 日志列表
export const DELETE_LOG = 'DELETE_LOG'; // 删除日志
export const FETCH_USERS = 'FETCH_USERS'; // 用户列表
export const ADD_USER = 'ADD_USER'; // 添加用户
export const DELETE_USER = 'DELETE_USER'; // 删除用户
export const UPDATE_USER_STATUS = 'UPDATE_USER_STATUS'; // 用户启用/停用状态
export const MODIFY_USER = 'MODIFY_USER'; // 修改用户

// 智能应用-机动车检测
export const FETCH_VEHICLE_TASKS = 'FETCH_VEHICLE_TASKS'; // 机动车任务列表
export const FETCH_ACTIVE_TASKS = 'FETCH_ACTIVE_TASKS'; // 进行中的任务列表
export const ADD_VEHICLE_TASK = 'ADD_VEHICLE_TASK'; // 创建机动车任务
export const CLEAR_VEHICLE_TASK = 'CLEAR_VEHICLE_TASK'; // 清空任务
export const DELETE_VEHICLE_TASK = 'DELETE_VEHICLE_TASK'; // 批量删除任务
export const CLOSE_VEHICLE_TASK = 'CLOSE_VEHICLE_TASK'; // 批量关闭任务
export const GET_VEHICLE_RESULT = 'GET_VEHICLE_RESULT'; // 获取机动车任务结果详情
export const DELETE_VEHICLE_RESULT = 'DELETE_VEHICLE_RESULT'; // 批量删除结果
export const CLEAR_VEHICLE_RESULT = 'CLEAR_VEHICLE_RESULT'; // 清空结果
export const START_VEHICLE_TASK = 'START_VEHICLE_TASK'; // 开启任务
export const FETCH_VEHICLE_RESULTS = 'FETCH_VEHICLE_RESULTS'; // 获取机动车驾驶监控-结果列表
export const FETCH_MONITOR_PLAYPATH = 'FETCH_MONITOR_PLAYPATH'; // 获取播放流地址
export const FETCH_MONITOR_ANALYSIS = 'FETCH_MONITOR_ANALYSIS'; // 获取流量统计数据
export const FETCH_MONITOR_DATA = 'FETCH_MONITOR_DATA'; // 获取实时机动车, 行人列表
export const START_MONITOR = 'START_MONITOR'; // 实时交通监控开启
export const STOP_MONITOR = 'STOP_MONITOR'; // 实时交通监控关闭

// 智能应用-违章监控
export const FETCH_VIOLATIONS = 'FETCH_VIOLATIONS'; // 违章任务列表
export const DELETE_VIOLATION_TASKS = 'DELETE_VIOLATION_TASKS'; // 批量删除任务
export const CLEAR_VIOLATION_TASKS = 'CLEAR_VIOLATION_TASKS'; // 清空任务
export const SWITCH_VIOLATION_TASKS = 'SWITCH_VIOLATION_TASKS'; // 违章监控开关
export const ADD_VIOLATION_TASK = 'ADD_VIOLATION_TASK'; // 新增违章监控任务
export const MODIFY_VIOLATION_TASKS = 'MODIFY_VIOLATION_TASKS'; // 修改违章任务
export const FETCH_VIOLATION_RESULTS = 'FETCH_VIOLATION_RESULTS'; // 违章结果列表
export const DELETE_VIOLATION_RESULTS = 'DELETE_VIOLATION_RESULTS'; // 删除违章结果
export const CLEAR_VIOLATION_RESULTS = 'CLEAR_VIOLATION_RESULTS'; // 清空违章结果
export const GET_VIOLATION_RESULT = 'GET_VIOLATION_RESULT'; // 违章结果详细信息-城市道路违停

export const RESET_MONITOR_DATA = 'RESET_MONITOR_DATA'; // 重置数据
export const FETCH_CAMERA_TASKS = 'FETCH_CAMERA_TASKS'; // 已有摄像头名称列表

// 智能应用-复省车牌
export const GET_REVIEW_PLATE_TASKS = 'GET_REVIEW_PLATE_TASKS';
export const GET_REVIEW_PLATE_TASK = 'GET_REVIEW_PLATE_TASK';
export const GET_REVIEW_PLATE_PREVIEW_IMAGE = 'GET_REVIEW_PLATE_PREVIEW_IMAGE';
export const PUT_REVIEW_PLATE_AREA = 'PUT_REVIEW_PLATE_AREA';
export const PUT_REVIEW_PLATE_TASK_START = 'PUT_REVIEW_PLATE_TASK_START';
export const GET_REVIEW_PLATE_RESULTS = 'GET_REVIEW_PLATE_RESULTS';
export const GET_REVIEW_PLATE_TASK_STATISTICS = 'GET_REVIEW_PLATE_TASK_STATISTICS';
