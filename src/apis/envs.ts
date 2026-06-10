import { request, requestMultipart } from '../http';
import {
  CreateEnvItem,
  Env,
  EnvLabelsRequest,
  ListEnvsQuery,
  MoveEnvRequest,
  UpdateEnvNamesRequest,
  UpdateEnvRequest,
} from '../types';

/** 环境变量 API，需要 `envs` scope。 @category API */
export class EnvsApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取环境变量列表 */
  list(query?: ListEnvsQuery): Promise<Env[]> {
    return request<Env[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/envs',
      query,
    }, this.getToken);
  }

  /** 按 ID 获取单个环境变量 */
  getById(id: number): Promise<Env> {
    return request<Env>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/envs/${id}`,
    }, this.getToken);
  }

  /** 批量创建环境变量 */
  create(items: CreateEnvItem[]): Promise<Env[]> {
    return request<Env[]>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/envs',
      body: items,
    }, this.getToken);
  }

  /** 更新环境变量 */
  update(body: UpdateEnvRequest): Promise<Env> {
    return request<Env>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/envs',
      body,
    }, this.getToken);
  }

  /** 批量删除环境变量 */
  delete(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/envs',
      body: ids,
    }, this.getToken);
  }

  /** 移动环境变量位置 */
  move(id: number, body: MoveEnvRequest): Promise<Env> {
    return request<Env>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: `/envs/${id}/move`,
      body,
    }, this.getToken);
  }

  /** 批量禁用环境变量 */
  disable(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/envs/disable',
      body: ids,
    }, this.getToken);
  }

  /** 批量启用环境变量 */
  enable(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/envs/enable',
      body: ids,
    }, this.getToken);
  }

  /** 批量重命名环境变量 */
  updateNames(body: UpdateEnvNamesRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/envs/name',
      body,
    }, this.getToken);
  }

  /** 置顶环境变量 */
  pin(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/envs/pin',
      body: ids,
    }, this.getToken);
  }

  /** 取消置顶环境变量 */
  unpin(ids: number[]): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/envs/unpin',
      body: ids,
    }, this.getToken);
  }

  /** 添加标签 */
  addLabels(body: EnvLabelsRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/envs/labels',
      body,
    }, this.getToken);
  }

  /** 移除标签 */
  removeLabels(body: EnvLabelsRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/envs/labels',
      body,
    }, this.getToken);
  }

  /** 上传环境变量 JSON 文件（multipart，字段名 env） */
  upload(file: Blob | File): Promise<Env[]> {
    const formData = new FormData();
    formData.append('env', file);
    return requestMultipart<Env[]>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/envs/upload',
      formData,
    }, this.getToken);
  }
}
