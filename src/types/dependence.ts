/** 依赖状态 */
export enum DependenceStatus {
  Installing = 0,
  Installed = 1,
  InstallFailed = 2,
  Removing = 3,
  Removed = 4,
  RemoveFailed = 5,
  Queued = 6,
  Cancelled = 7,
}

/** 依赖类型 */
export enum DependenceType {
  Nodejs = 0,
  Python3 = 1,
  Linux = 2,
}

/** 依赖实体（对应 back/data/dependence.ts） */
export interface Dependence {
  id?: number;
  name: string;
  type: DependenceType;
  status: DependenceStatus;
  timestamp?: string;
  log?: string[];
  remark?: string;
}

/** GET /open/dependencies 查询参数 */
export interface ListDependenciesQuery {
  searchValue?: string;
  type?: string;
  status?: string;
}

/** POST /open/dependencies 单项 */
export interface CreateDependenceItem {
  name: string;
  type: DependenceType;
  remark?: string;
}

/** PUT /open/dependencies 更新请求 */
export interface UpdateDependenceRequest {
  id: number;
  name: string;
  type: DependenceType;
  remark?: string;
}
