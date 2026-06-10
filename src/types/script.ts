import { FilePathRequest } from './file';

/** GET /open/scripts 查询参数 */
export interface ListScriptsQuery {
  path?: string;
}

/** GET /open/scripts/detail 查询参数 */
export interface ScriptDetailQuery {
  path?: string;
  file: string;
}

/** POST /open/scripts 创建/上传请求 */
export interface CreateScriptRequest {
  filename: string;
  path?: string;
  content?: string;
  originFilename?: string;
  /** 创建目录时使用 */
  directory?: string;
}

/** PUT /open/scripts 更新脚本内容 */
export interface UpdateScriptRequest {
  filename: string;
  path?: string;
  content: string;
}

/** DELETE /open/scripts 删除请求 */
export interface DeleteScriptRequest extends FilePathRequest {
  type?: string;
}

/** PUT /open/scripts/run 运行脚本 */
export interface RunScriptRequest {
  filename: string;
  path?: string;
  content?: string;
}

/** PUT /open/scripts/stop 停止脚本 */
export interface StopScriptRequest {
  filename: string;
  path?: string;
  pid?: number | '';
}

/** PUT /open/scripts/rename 重命名 */
export interface RenameScriptRequest {
  filename: string;
  path?: string;
  newFilename: string;
}
