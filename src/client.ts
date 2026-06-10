import { TokenManager } from './auth';
import { ConfigsApi } from './apis/configs';
import { CronsApi } from './apis/crons';
import { DependenciesApi } from './apis/dependencies';
import { EnvsApi } from './apis/envs';
import { LogsApi } from './apis/logs';
import { ScriptsApi } from './apis/scripts';
import { SubscriptionsApi } from './apis/subscriptions';
import { SystemApi } from './apis/system';
import { QinglongClientOptions } from './types';

/**
 * 青龙 Open API 客户端。
 *
 * 通过应用 client_id / client_secret 自动获取并管理 Bearer Token，
 * 按 scope 调用 /open/* 接口。
 *
 * @category Client
 * @example
 * ```typescript
 * const client = new QinglongClient({
 *   baseUrl: 'http://localhost:5700',
 *   clientId: 'your_client_id',
 *   clientSecret: 'your_client_secret',
 * });
 *
 * await client.envs.list();
 * await client.crons.run([1]);
 * await client.system.notify({ title: 'Hi', content: 'Hello' });
 * ```
 */
export class QinglongClient {
  private readonly fetchFn: typeof fetch;
  private readonly tokenManager: TokenManager;

  /** 环境变量 API（需要 envs scope） */
  readonly envs: EnvsApi;
  /** 定时任务 API（需要 crons scope） */
  readonly crons: CronsApi;
  /** 订阅管理 API（需要 subscriptions scope） */
  readonly subscriptions: SubscriptionsApi;
  /** 配置文件 API（需要 configs scope） */
  readonly configs: ConfigsApi;
  /** 脚本管理 API（需要 scripts scope） */
  readonly scripts: ScriptsApi;
  /** 日志管理 API（需要 logs scope） */
  readonly logs: LogsApi;
  /** 依赖管理 API（需要 dependencies scope） */
  readonly dependencies: DependenciesApi;
  /** 系统管理 API（需要 system scope） */
  readonly system: SystemApi;

  constructor(options: QinglongClientOptions) {
    this.fetchFn = options.fetch ?? globalThis.fetch;
    this.tokenManager = new TokenManager(options, this.fetchFn);

    const getToken = () => this.tokenManager.getToken();
    const { baseUrl } = options;

    this.envs = new EnvsApi(this.fetchFn, baseUrl, getToken);
    this.crons = new CronsApi(this.fetchFn, baseUrl, getToken);
    this.subscriptions = new SubscriptionsApi(this.fetchFn, baseUrl, getToken);
    this.configs = new ConfigsApi(this.fetchFn, baseUrl, getToken);
    this.scripts = new ScriptsApi(this.fetchFn, baseUrl, getToken);
    this.logs = new LogsApi(this.fetchFn, baseUrl, getToken);
    this.dependencies = new DependenciesApi(this.fetchFn, baseUrl, getToken);
    this.system = new SystemApi(this.fetchFn, baseUrl, getToken);
  }
}
