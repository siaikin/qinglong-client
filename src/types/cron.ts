/** 定时任务状态（对应 back/data/cron.ts CrontabStatus） */
export enum CrontabStatus {
  /** 运行中 */
  Running = 0,
  /** 空闲 */
  Idle = 1,
  /** 已禁用 */
  Disabled = 2,
  /** 排队中 */
  Queued = 3,
}

/** 运行实例状态 */
export enum InstanceStatus {
  /** 运行中 */
  Running = 0,
  /** 已完成 */
  Finished = 1,
  /** 已停止 */
  Stopped = 2,
  /** 出错 */
  Error = 3,
}

/** 额外定时规则 */
export interface ExtraSchedule {
  schedule: string;
}

/** 创建/更新定时任务请求体（来自 commonCronSchema） */
export interface CronMutationRequest {
  /** 任务名称 */
  name?: string;
  /** 执行的命令或脚本，必填 */
  command: string;
  /**
   * 标准 5 位 cron 表达式，或特殊值 once / boot（前缀 @）
   * @remarks 无效的定时规则会被服务端拒绝
   */
  schedule: string;
  /** 标签列表 */
  labels?: string[];
  /** 关联订阅 ID，null 表示无 */
  sub_id?: number | null;
  /** 额外定时规则 */
  extra_schedules?: ExtraSchedule[] | null;
  /** 任务执行前命令 */
  task_before?: string | null;
  /** 任务执行后命令 */
  task_after?: string | null;
  /**
   * 自定义日志路径
   * @remarks 相对路径限字母数字下划线连字符；绝对路径须在日志目录内或使用 /dev/null
   */
  log_name?: string | null;
  /** 是否允许多实例：0=否，1=是 */
  allow_multiple_instances?: 0 | 1 | null;
  /** 工作目录 */
  work_dir?: string | null;
}

/** 更新定时任务请求体 */
export interface UpdateCronRequest extends CronMutationRequest {
  id: number;
}

/** 定时任务完整实体 */
export interface Crontab extends CronMutationRequest {
  id?: number;
  status?: CrontabStatus;
  isSystem?: 0 | 1;
  isDisabled?: 0 | 1;
  isPinned?: 0 | 1;
  pid?: number;
  log_path?: string;
  last_running_time?: number;
  last_execution_time?: number;
  timestamp?: string;
  saved?: boolean;
}

/** GET /open/crons 查询参数 */
export interface ListCronsQuery {
  searchValue?: string;
  ids?: string;
  labels?: string;
  sub_id?: string;
  status?: string;
  isDisabled?: string;
  filters?: string;
  filterRelation?: string;
  sorts?: string;
  view?: string;
}

/** GET /open/crons/detail 查询参数 */
export interface CronDetailQuery {
  id?: number;
  name?: string;
  command?: string;
  schedule?: string;
}

/** PUT /open/crons/status 更新运行状态 */
export interface UpdateCronStatusRequest {
  ids: number[];
  /** 状态值（字符串形式，服务端会 parseInt） */
  status: string;
  pid?: string | null;
  log_path?: string | null;
  last_running_time?: number | null;
  last_execution_time?: number | null;
}

/** POST/DELETE /open/crons/labels 标签操作 */
export interface CronLabelsRequest {
  ids: number[];
  labels: string[];
}

/** 运行实例 */
export interface RunningInstance {
  id?: number;
  cron_id: number;
  pid?: number;
  log_path?: string;
  started_at: number;
  finished_at?: number;
  status: InstanceStatus;
  exit_code?: number;
}

/** 视图排序 */
export interface CronViewSort {
  type: 'ASC' | 'DESC';
  value: string;
}

/** 视图筛选 */
export interface CronViewFilter {
  property: string;
  operation: string;
  value: string;
}

/** 定时任务视图 */
export interface CronView {
  id?: number;
  name?: string;
  position?: number;
  isDisabled?: 0 | 1;
  filters?: CronViewFilter[];
  sorts?: CronViewSort[] | null;
  filterRelation?: 'and' | 'or';
  /** 1=系统视图，2=个人视图 */
  type?: 1 | 2;
}

/** POST /open/crons/views 创建视图 */
export interface CreateCronViewRequest {
  name: string;
  sorts?: CronViewSort[] | null;
  filters?: CronViewFilter[];
  filterRelation?: string;
}

/** PUT /open/crons/views 更新视图 */
export interface UpdateCronViewRequest extends CreateCronViewRequest {
  id: number;
}

/** PUT /open/crons/views/move 移动视图 */
export interface MoveCronViewRequest {
  id: number;
  fromIndex: number;
  toIndex: number;
}

/** 日志文件信息 */
export interface LogFileInfo {
  title: string;
  key: string;
  type: 'directory' | 'file';
  parent: string;
  createTime: number;
  size?: number;
  children?: LogFileInfo[];
}
