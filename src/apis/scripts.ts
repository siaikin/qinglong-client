import { request, requestBlob } from '../http';
import {
  CreateScriptRequest,
  DeleteScriptRequest,
  FileNode,
  ListScriptsQuery,
  RenameScriptRequest,
  RunScriptRequest,
  ScriptDetailQuery,
  StopScriptRequest,
  UpdateScriptRequest,
} from '../types';

/** 脚本管理 API，需要 `scripts` scope。 @category API */
export class ScriptsApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取脚本目录树 */
  list(query?: ListScriptsQuery): Promise<FileNode[]> {
    return request<FileNode[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/scripts',
      query,
    }, this.getToken);
  }

  /** 读取脚本内容 */
  getDetail(query: ScriptDetailQuery): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/scripts/detail',
      query,
    }, this.getToken);
  }

  /** 按文件名读取脚本 */
  getFile(file: string, query?: { path?: string }): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/scripts/${file}`,
      query,
    }, this.getToken);
  }

  /** 创建脚本或目录 */
  create(body: CreateScriptRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/scripts',
      body,
    }, this.getToken);
  }

  /** 更新脚本内容 */
  update(body: UpdateScriptRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/scripts',
      body,
    }, this.getToken);
  }

  /** 删除脚本或目录 */
  delete(body: DeleteScriptRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/scripts',
      body,
    }, this.getToken);
  }

  /** 运行脚本 */
  run(body: RunScriptRequest): Promise<unknown> {
    return request<unknown>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/scripts/run',
      body,
    }, this.getToken);
  }

  /** 停止运行中的脚本 */
  stop(body: StopScriptRequest): Promise<unknown> {
    return request<unknown>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/scripts/stop',
      body,
    }, this.getToken);
  }

  /** 重命名脚本 */
  rename(body: RenameScriptRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/scripts/rename',
      body,
    }, this.getToken);
  }

  /** 下载脚本文件 */
  download(body: { filename: string; path?: string }): Promise<Blob> {
    return requestBlob(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/scripts/download',
      body,
    }, this.getToken);
  }
}
