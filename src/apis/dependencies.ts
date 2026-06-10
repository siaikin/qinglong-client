import { request } from '../http';
import {
  CreateDependenceItem,
  Dependence,
  ListDependenciesQuery,
  UpdateDependenceRequest,
} from '../types';

/** 依赖管理 API，需要 `dependencies` scope。 @category API */
export class DependenciesApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取依赖列表 */
  list(query?: ListDependenciesQuery): Promise<Dependence[]> {
    return request<Dependence[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/dependencies',
      query,
    }, this.getToken);
  }

  /** 按 ID 获取依赖 */
  getById(id: number): Promise<Dependence> {
    return request<Dependence>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/dependencies/${id}`,
    }, this.getToken);
  }

  /** 批量创建依赖 */
  create(items: CreateDependenceItem[]): Promise<Dependence[]> {
    return request<Dependence[]>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/dependencies',
      body: items,
    }, this.getToken);
  }

  /** 更新依赖 */
  update(body: UpdateDependenceRequest): Promise<Dependence> {
    return request<Dependence>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/dependencies',
      body,
    }, this.getToken);
  }

  /** 删除依赖 */
  delete(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/dependencies',
      body: ids,
    }, this.getToken);
  }

  /** 强制删除依赖 */
  forceDelete(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/dependencies/force',
      body: ids,
    }, this.getToken);
  }

  /** 重新安装依赖 */
  reinstall(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/dependencies/reinstall',
      body: ids,
    }, this.getToken);
  }

  /** 取消安装中的依赖 */
  cancel(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/dependencies/cancel',
      body: ids,
    }, this.getToken);
  }
}
