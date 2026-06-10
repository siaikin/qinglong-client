import { request } from '../http';
import { ConfigDetailQuery, ConfigFileItem, SaveConfigRequest } from '../types';

/** 配置文件 API，需要 `configs` scope。 @category API */
export class ConfigsApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取示例配置文件名列表 */
  listSamples(): Promise<string[]> {
    return request<string[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/configs/samples',
    }, this.getToken);
  }

  /** 获取配置文件列表 */
  listFiles(): Promise<ConfigFileItem[]> {
    return request<ConfigFileItem[]>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/configs/files',
    }, this.getToken);
  }

  /** 读取配置文件内容（通过 query path） */
  getDetail(query: ConfigDetailQuery): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/configs/detail',
      query,
    }, this.getToken);
  }

  /** 读取配置文件内容（通过文件名） */
  getFile(file: string): Promise<string> {
    return request<string>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: `/configs/${file}`,
    }, this.getToken);
  }

  /** 保存配置文件 */
  save(body: SaveConfigRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'POST',
      path: '/configs/save',
      body,
    }, this.getToken);
  }
}
