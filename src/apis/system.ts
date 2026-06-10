import { request, requestBlob, requestMultipart, requestText } from '../http';
import {
  CleanDependenceRequest,
  CommandRunRequest,
  CommandStopRequest,
  ExportDataRequest,
  NotifyRequest,
  QinglongResponse,
  ReloadRequest,
  ResetAuthRequest,
  SystemConfig,
  SystemInfo,
  SystemLogQuery,
  UpdateCronConcurrencyRequest,
  UpdateDependenceProxyRequest,
  UpdateGlobalSshKeyRequest,
  UpdateLinuxMirrorRequest,
  UpdateLogRemoveFrequencyRequest,
  UpdateNodeMirrorRequest,
  UpdatePythonMirrorRequest,
  UpdateTimezoneRequest,
} from '../types';

/** 系统管理 API，需要 `system` scope。 @category API */
export class SystemApi {
  constructor(
    private readonly fetchFn: typeof fetch,
    private readonly baseUrl: string,
    private readonly getToken: () => Promise<string>,
  ) {}

  /** 获取系统信息（无需鉴权） */
  info(): Promise<SystemInfo> {
    return request<SystemInfo>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/system',
      auth: false,
    });
  }

  /** 获取系统配置 */
  getConfig(): Promise<SystemConfig> {
    return request<SystemConfig>(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/system/config',
    }, this.getToken);
  }

  /** 发送系统通知 */
  notify(body: NotifyRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/notify',
      body,
    }, this.getToken);
  }

  /** 运行 shell 命令（流式文本响应） */
  commandRun(body: CommandRunRequest): Promise<string> {
    return requestText(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/command-run',
      body,
    }, this.getToken);
  }

  /** 停止运行中的命令 */
  commandStop(body: CommandStopRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/command-stop',
      body,
    }, this.getToken);
  }

  /** 检查更新 */
  checkUpdate(): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/update-check',
    }, this.getToken);
  }

  /** 更新青龙面板 */
  update(): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/update',
    }, this.getToken);
  }

  /** 重载系统 */
  reload(body?: ReloadRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/reload',
      body,
    }, this.getToken);
  }

  /** 导出数据（返回压缩包 Blob） */
  exportData(body?: ExportDataRequest): Promise<Blob> {
    return requestBlob(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/data/export',
      body,
    }, this.getToken);
  }

  /** 导入数据（multipart 上传 data.tgz） */
  importData(file: Blob | File): Promise<QinglongResponse> {
    const formData = new FormData();
    formData.append('data', file);
    return requestMultipart<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/data/import',
      formData,
    }, this.getToken);
  }

  /** 获取系统日志（流式文本） */
  getLog(query?: SystemLogQuery): Promise<string> {
    return requestText(this.fetchFn, this.baseUrl, {
      method: 'GET',
      path: '/system/log',
      query,
    }, this.getToken);
  }

  /** 删除系统日志 */
  deleteLog(): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'DELETE',
      path: '/system/log',
    }, this.getToken);
  }

  /** 重置管理员认证信息 */
  resetAuth(body: ResetAuthRequest): Promise<void> {
    return request<void>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/auth/reset',
      body,
    }, this.getToken);
  }

  // --- 配置项更新 ---

  updateLogRemoveFrequency(body: UpdateLogRemoveFrequencyRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/log-remove-frequency',
      body,
    }, this.getToken);
  }

  updateCronConcurrency(body: UpdateCronConcurrencyRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/cron-concurrency',
      body,
    }, this.getToken);
  }

  updateDependenceProxy(body: UpdateDependenceProxyRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/dependence-proxy',
      body,
    }, this.getToken);
  }

  /** 更新 Node 镜像（流式文本响应） */
  updateNodeMirror(body: UpdateNodeMirrorRequest): Promise<string> {
    return requestText(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/node-mirror',
      body,
    }, this.getToken);
  }

  updatePythonMirror(body: UpdatePythonMirrorRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/python-mirror',
      body,
    }, this.getToken);
  }

  /** 更新 Linux 镜像（流式文本响应） */
  updateLinuxMirror(body: UpdateLinuxMirrorRequest): Promise<string> {
    return requestText(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/linux-mirror',
      body,
    }, this.getToken);
  }

  updateTimezone(body: UpdateTimezoneRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/timezone',
      body,
    }, this.getToken);
  }

  updateGlobalSshKey(body: UpdateGlobalSshKeyRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/global-ssh-key',
      body,
    }, this.getToken);
  }

  cleanDependence(body: CleanDependenceRequest): Promise<QinglongResponse> {
    return request<QinglongResponse>(this.fetchFn, this.baseUrl, {
      method: 'PUT',
      path: '/system/config/dependence-clean',
      body,
    }, this.getToken);
  }
}
