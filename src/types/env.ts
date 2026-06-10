/** 环境变量状态 */
export enum EnvStatus {
  /** 正常 */
  Normal = 0,
  /** 已禁用 */
  Disabled = 1,
}

/** 环境变量实体（对应 back/data/env.ts） */
export interface Env {
  /** 环境变量 ID */
  id?: number;
  /**
   * 变量名
   * @remarks 必须以字母或下划线开头，仅含字母/数字/下划线
   */
  name?: string;
  /** 变量值 */
  value?: string;
  /** 备注 */
  remarks?: string;
  /** 状态 */
  status?: EnvStatus;
  /** 排序位置 */
  position?: number;
  /** 是否置顶：0=否，1=是 */
  isPinned?: 0 | 1;
  /** 标签列表 */
  labels?: string[];
  /** 时间戳 */
  timestamp?: string;
}

/** POST /open/envs 单项（批量创建） */
export interface CreateEnvItem {
  /**
   * 变量名
   * @remarks 正则：/^[a-zA-Z_][0-9a-zA-Z_]*$/
   */
  name: string;
  /** 变量值 */
  value: string;
  /** 备注 */
  remarks?: string;
  /** 标签 */
  labels?: string[];
}

/** PUT /open/envs 更新请求体 */
export interface UpdateEnvRequest {
  id: number;
  name: string;
  value: string;
  remarks?: string | null;
  labels?: string[];
}

/** GET /open/envs 查询参数 */
export interface ListEnvsQuery {
  /** 搜索关键词 */
  searchValue?: string;
}

/** PUT /open/envs/:id/move 请求体 */
export interface MoveEnvRequest {
  fromIndex: number;
  toIndex: number;
}

/** PUT /open/envs/name 批量重命名 */
export interface UpdateEnvNamesRequest {
  ids: number[];
  name: string;
}

/** POST/DELETE /open/envs/labels 标签操作 */
export interface EnvLabelsRequest {
  ids: number[];
  labels: string[];
}
