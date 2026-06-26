/** 订阅状态 */
export enum SubscriptionStatus {
  /** 运行中 */
  Running = 0,
  /** 空闲 */
  Idle = 1,
  /** 已禁用 */
  Disabled = 2,
  /** 排队中 */
  Queued = 3,
}

/** 订阅类型 */
export type SubscriptionType = 'public-repo' | 'private-repo' | 'file';

/** 定时类型 */
export type ScheduleType = 'crontab' | 'interval';

/** 拉取方式 */
export type PullType = 'ssh-key' | 'user-pwd';

/** 间隔定时配置 */
export interface IntervalSchedule {
  type: string;
  value: number;
}

/** SSH 拉取配置 */
export interface SshPullOption {
  private_key: string;
}

/** 用户名密码拉取配置 */
export interface UserPwdPullOption {
  username: string;
  password: string;
}

/** 订阅实体（对应 back/data/subscription.ts） */
export interface Subscription {
  id?: number;
  name?: string;
  /** 订阅类型 */
  type?: SubscriptionType;
  schedule_type?: ScheduleType;
  schedule?: string;
  interval_schedule?: IntervalSchedule;
  url?: string;
  whitelist?: string;
  blacklist?: string;
  dependences?: string;
  branch?: string;
  status?: SubscriptionStatus;
  pull_type?: PullType;
  pull_option?: SshPullOption | UserPwdPullOption;
  pid?: number;
  is_disabled?: 0 | 1;
  log_path?: string;
  /** 别名，创建时必填 */
  alias: string;
  command?: string;
  extensions?: string;
  sub_before?: string;
  sub_after?: string;
  proxy?: string;
  autoAddCron?: 0 | 1;
  autoDelCron?: 0 | 1;
}

/** POST /open/subscriptions 创建请求 */
export interface CreateSubscriptionRequest {
  type: string;
  url: string;
  alias: string;
  schedule_type: string;
  schedule?: string | null;
  interval_schedule?: IntervalSchedule | null;
  name?: string | null;
  whitelist?: string | null;
  blacklist?: string | null;
  branch?: string | null;
  dependences?: string | null;
  pull_type?: string | null;
  pull_option?: Record<string, unknown> | null;
  extensions?: string | null;
  sub_before?: string | null;
  sub_after?: string | null;
  proxy?: string | null;
  autoAddCron?: boolean | null;
  autoDelCron?: boolean | null;
}

/** PUT /open/subscriptions 更新请求 */
export interface UpdateSubscriptionRequest extends CreateSubscriptionRequest {
  id: number;
}

/** GET /open/subscriptions 查询参数 */
export interface ListSubscriptionsQuery {
  searchValue?: string;
  /** JSON 数组字符串，如 `"[1,2,3]"`（服务端 JSON.parse 解析） */
  ids?: string;
}

/** DELETE /open/subscriptions 查询参数 */
export interface DeleteSubscriptionsQuery {
  force?: boolean;
}

/** PUT /open/subscriptions/status 更新状态 */
export interface UpdateSubscriptionStatusRequest {
  ids: number[];
  status: string;
  pid?: string;
  log_path?: string;
}
