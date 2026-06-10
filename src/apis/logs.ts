import { request, requestBlob } from '../http';
import {
  DeleteLogRequest,
  FileNode,
  LogDetailQuery,
  LogFileQuery,
} from '../types';

/** 日志管理 API，需要 `logs` scope。 @category API */
export class LogsApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取日志目录树 */
  list(): Promise<FileNode[]> {
    return request<FileNode[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/logs',
    }, this.getToken);
  }

  /** 读取日志内容（ANSI 已剥离） */
  getDetail(query: LogDetailQuery): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/logs/detail',
      query,
    }, this.getToken);
  }

  /** 按文件名读取日志 */
  getFile(file: string, query?: LogFileQuery): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/logs/${file}`,
      query,
    }, this.getToken);
  }

  /** 删除日志文件 */
  delete(body: DeleteLogRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/logs',
      body,
    }, this.getToken);
  }

  /** 下载日志文件 */
  download(body: { filename: string; path?: string }): Promise<Blob> {
    return requestBlob(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/logs/download',
      body,
    }, this.getToken);
  }
}
