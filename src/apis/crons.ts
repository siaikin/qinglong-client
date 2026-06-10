import { request } from '../http';
import {
  CreateCronViewRequest,
  CronDetailQuery,
  CronLabelsRequest,
  CronMutationRequest,
  CronView,
  Crontab,
  ListCronsQuery,
  LogFileInfo,
  MoveCronViewRequest,
  RunningInstance,
  UpdateCronRequest,
  UpdateCronStatusRequest,
  UpdateCronViewRequest,
} from '../types';

/** 定时任务 API，需要 `crons` scope。 @category API */
export class CronsApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取定时任务列表 */
  list(query?: ListCronsQuery): Promise<Crontab[]> {
    return request<Crontab[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/crons',
      query,
    }, this.getToken);
  }

  /** 按条件查询单个定时任务详情 */
  detail(query: CronDetailQuery): Promise<Crontab | null> {
    return request<Crontab | null>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/crons/detail',
      query,
    }, this.getToken);
  }

  /** 按 ID 获取定时任务 */
  getById(id: number): Promise<Crontab> {
    return request<Crontab>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/crons/${id}`,
    }, this.getToken);
  }

  /** 创建定时任务 */
  create(body: CronMutationRequest): Promise<Crontab> {
    return request<Crontab>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/crons',
      body,
    }, this.getToken);
  }

  /** 更新定时任务 */
  update(body: UpdateCronRequest): Promise<Crontab> {
    return request<Crontab>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons',
      body,
    }, this.getToken);
  }

  /** 批量删除定时任务 */
  delete(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/crons',
      body: ids,
    }, this.getToken);
  }

  /** 运行定时任务 */
  run(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/run',
      body: ids,
    }, this.getToken);
  }

  /** 停止定时任务 */
  stop(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/stop',
      body: ids,
    }, this.getToken);
  }

  /** 禁用定时任务 */
  disable(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/disable',
      body: ids,
    }, this.getToken);
  }

  /** 启用定时任务 */
  enable(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/enable',
      body: ids,
    }, this.getToken);
  }

  /** 置顶定时任务 */
  pin(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/pin',
      body: ids,
    }, this.getToken);
  }

  /** 取消置顶定时任务 */
  unpin(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/unpin',
      body: ids,
    }, this.getToken);
  }

  /** 更新定时任务运行状态 */
  updateStatus(body: UpdateCronStatusRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/status',
      body,
    }, this.getToken);
  }

  /** 添加标签 */
  addLabels(body: CronLabelsRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/crons/labels',
      body,
    }, this.getToken);
  }

  /** 移除标签 */
  removeLabels(body: CronLabelsRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/crons/labels',
      body,
    }, this.getToken);
  }

  /** 从 crontab 文件导入 */
  import(): Promise<unknown> {
    return request<unknown>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/crons/import',
    }, this.getToken);
  }

  /** 获取任务当前日志 */
  getLog(id: number): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/crons/${id}/log`,
    }, this.getToken);
  }

  /** 获取任务日志文件列表 */
  getLogs(id: number): Promise<LogFileInfo[]> {
    return request<LogFileInfo[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/crons/${id}/logs`,
    }, this.getToken);
  }

  /** 获取运行中的实例列表 */
  getInstances(id: number): Promise<RunningInstance[]> {
    return request<RunningInstance[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/crons/${id}/instances`,
    }, this.getToken);
  }

  /** 停止指定运行实例 */
  stopInstance(cronId: number, instanceId: number): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: `/crons/${cronId}/instances/${instanceId}/stop`,
    }, this.getToken);
  }

  // --- 视图 ---

  /** 获取视图列表 */
  listViews(): Promise<CronView[]> {
    return request<CronView[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/crons/views',
    }, this.getToken);
  }

  /** 创建视图 */
  createView(body: CreateCronViewRequest): Promise<CronView> {
    return request<CronView>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/crons/views',
      body,
    }, this.getToken);
  }

  /** 更新视图 */
  updateView(body: UpdateCronViewRequest): Promise<CronView> {
    return request<CronView>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/views',
      body,
    }, this.getToken);
  }

  /** 删除视图 */
  deleteViews(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/crons/views',
      body: ids,
    }, this.getToken);
  }

  /** 移动视图位置 */
  moveView(body: MoveCronViewRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/views/move',
      body,
    }, this.getToken);
  }

  /** 禁用视图 */
  disableViews(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/views/disable',
      body: ids,
    }, this.getToken);
  }

  /** 启用视图 */
  enableViews(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/crons/views/enable',
      body: ids,
    }, this.getToken);
  }
}
