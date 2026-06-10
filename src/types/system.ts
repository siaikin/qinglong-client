/** 系统信息（GET /open/system，无需鉴权） */
export interface SystemInfo {
  isInitialized: boolean;
  version: string;
  publishTime: number;
  branch: string;
  changeLog: string;
  changeLogLink: string;
}

/** 系统配置（对应 back/data/system.ts SystemConfigInfo） */
export interface SystemConfig {
  logRemoveFrequency?: number;
  cronConcurrency?: number;
  dependenceProxy?: string;
  nodeMirror?: string;
  pythonMirror?: string;
  linuxMirror?: string;
  timezone?: string;
  globalSshKey?: string;
}

/** PUT /open/system/notify 发送通知 */
export interface NotifyRequest {
  title: string;
  content: string;
}

/** PUT /open/system/command-run 运行命令 */
export interface CommandRunRequest {
  command: string;
}

/** PUT /open/system/command-stop 停止命令 */
export interface CommandStopRequest {
  command?: string;
  pid?: number;
}

/** PUT /open/system/reload 重载系统 */
export interface ReloadRequest {
  type?: string | null;
}

/** PUT /open/system/data/export 导出数据 */
export interface ExportDataRequest {
  type?: string[];
}

/** PUT /open/system/auth/reset 重置认证 */
export interface ResetAuthRequest {
  retries?: number;
  twoFactorActivated?: boolean;
  password?: string;
  username?: string;
}

/** GET /open/system/log 查询参数 */
export interface SystemLogQuery {
  startTime?: string;
  endTime?: string;
}

/** 各配置项更新请求 */
export interface UpdateLogRemoveFrequencyRequest {
  logRemoveFrequency: number | null;
}

export interface UpdateCronConcurrencyRequest {
  cronConcurrency: number | null;
}

export interface UpdateDependenceProxyRequest {
  dependenceProxy: string | null;
}

export interface UpdateNodeMirrorRequest {
  nodeMirror: string | null;
}

export interface UpdatePythonMirrorRequest {
  pythonMirror: string | null;
}

export interface UpdateLinuxMirrorRequest {
  linuxMirror: string | null;
}

export interface UpdateTimezoneRequest {
  timezone: string | null;
}

export interface UpdateGlobalSshKeyRequest {
  globalSshKey: string | null;
}

export interface CleanDependenceRequest {
  type?: string;
}
