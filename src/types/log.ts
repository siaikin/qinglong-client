import { FilePathRequest } from './file';

/** GET /open/logs/detail 查询参数 */
export interface LogDetailQuery {
  path?: string;
  file: string;
}

/** GET /open/logs/:file 查询参数 */
export interface LogFileQuery {
  path?: string;
}

/** DELETE /open/logs 删除请求 */
export interface DeleteLogRequest extends FilePathRequest {
  type?: string;
}
