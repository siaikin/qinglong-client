/**
 * @module Types
 * @category Types
 */

/** Open API 应用权限范围 */
export type AppScope =
  | 'crons'
  | 'envs'
  | 'subscriptions'
  | 'configs'
  | 'scripts'
  | 'logs'
  | 'dependencies'
  | 'system'
  | 'dashboard';

/** 青龙统一 API 响应格式 */
export interface QinglongResponse<T = unknown> {
  /** 业务状态码，200 表示成功 */
  code: number;
  /** 响应数据 */
  data?: T;
  /** 错误或提示信息 */
  message?: string;
  /** 校验错误详情（Celebrate/Joi） */
  errors?: Array<{ message: string; value?: unknown }>;
}

/** API 业务错误 */
export class QinglongApiError extends Error {
  readonly code: number;
  readonly errors?: QinglongResponse['errors'];

  constructor(response: QinglongResponse) {
    super(response.message ?? `API error: code ${response.code}`);
    this.name = 'QinglongApiError';
    this.code = response.code;
    this.errors = response.errors;
  }
}

/** 客户端配置 */
export interface QinglongClientOptions {
  /** 青龙面板地址，如 http://localhost:5700 或 http://host/ql */
  baseUrl: string;
  /** 应用 Client ID（系统设置 -> 应用设置） */
  clientId: string;
  /** 应用 Client Secret */
  clientSecret: string;
  /** 自定义 fetch 实现，默认使用全局 fetch */
  fetch?: typeof fetch;
  /** Token 过期前多少秒自动刷新，默认 300（5 分钟） */
  tokenRefreshBuffer?: number;
}

/** HTTP 请求方法 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/** 内部请求选项 */
export interface RequestOptions {
  method?: HttpMethod;
  path: string;
  query?: object;
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
}
