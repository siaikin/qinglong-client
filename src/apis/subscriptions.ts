import { request } from '../http';
import {
  CreateSubscriptionRequest,
  DeleteSubscriptionsQuery,
  ListSubscriptionsQuery,
  LogFileInfo,
  Subscription,
  UpdateSubscriptionRequest,
  UpdateSubscriptionStatusRequest,
} from '../types';

/** 订阅管理 API，需要 `subscriptions` scope。 @category API */
export class SubscriptionsApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取订阅列表 */
  list(query?: ListSubscriptionsQuery): Promise<Subscription[]> {
    return request<Subscription[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/subscriptions',
      query,
    }, this.getToken);
  }

  /** 按 ID 获取订阅 */
  getById(id: number): Promise<Subscription> {
    return request<Subscription>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/subscriptions/${id}`,
    }, this.getToken);
  }

  /** 创建订阅 */
  create(body: CreateSubscriptionRequest): Promise<Subscription> {
    return request<Subscription>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/subscriptions',
      body,
    }, this.getToken);
  }

  /** 更新订阅 */
  update(body: UpdateSubscriptionRequest): Promise<Subscription> {
    return request<Subscription>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/subscriptions',
      body,
    }, this.getToken);
  }

  /** 删除订阅 */
  delete(ids: number[], query?: DeleteSubscriptionsQuery): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/subscriptions',
      body: ids,
      query,
    }, this.getToken);
  }

  /** 运行订阅 */
  run(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/subscriptions/run',
      body: ids,
    }, this.getToken);
  }

  /** 停止订阅 */
  stop(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/subscriptions/stop',
      body: ids,
    }, this.getToken);
  }

  /** 禁用订阅 */
  disable(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/subscriptions/disable',
      body: ids,
    }, this.getToken);
  }

  /** 启用订阅 */
  enable(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/subscriptions/enable',
      body: ids,
    }, this.getToken);
  }

  /** 更新订阅运行状态 */
  updateStatus(body: UpdateSubscriptionStatusRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/subscriptions/status',
      body,
    }, this.getToken);
  }

  /** 获取订阅当前日志 */
  getLog(id: number): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/subscriptions/${id}/log`,
    }, this.getToken);
  }

  /** 获取订阅日志文件列表 */
  getLogs(id: number): Promise<LogFileInfo[]> {
    return request<LogFileInfo[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/subscriptions/${id}/logs`,
    }, this.getToken);
  }
}
