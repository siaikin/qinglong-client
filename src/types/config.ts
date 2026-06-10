/** 配置文件列表项 */
export interface ConfigFileItem {
  title: string;
  value: string;
}

/** GET /open/configs/detail 查询参数 */
export interface ConfigDetailQuery {
  path: string;
}

/** POST /open/configs/save 保存请求 */
export interface SaveConfigRequest {
  /** 配置文件名 */
  name: string;
  /** 文件内容 */
  content?: string;
}
