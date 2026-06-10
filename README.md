# qinglong-client

青龙面板 Open API（`/open/*`）的 TypeScript 客户端。

- 类型从青龙源码推导，附带 JSDoc 中文注释
- 自动 Token 获取与刷新
- 零运行时依赖，支持 Node.js 18+ 和现代 bundler
- 对应青龙版本：**2.20.2**

## 安装

```bash
pnpm add qinglong-client
```

## 快速开始

```typescript
import { QinglongClient } from 'qinglong-client';

const client = new QinglongClient({
  baseUrl: 'http://localhost:5700',
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
});

// 环境变量
const envs = await client.envs.list({ searchValue: '' });

// 定时任务
const cron = await client.crons.create({
  name: '每日签到',
  command: 'node sign.js',
  schedule: '0 8 * * *',
});

// 系统通知
await client.system.notify({ title: '完成', content: '任务执行成功' });
```

使用前需在青龙面板 **系统设置 → 应用设置** 中创建应用并勾选对应 scope 权限。

## 文档

### 手写指南

| 文档 | 说明 |
|------|------|
| [快速入门](docs/getting-started.md) | 安装、认证、配置、特殊接口 |
| [API 参考](docs/api-reference.md) | 全部 API 方法（8 模块 / 105+ 端点） |
| [类型参考](docs/types.md) | TypeScript 类型与枚举 |
| [常见问题](docs/faq.md) | 401 排查、baseUrl、批量操作等 |

### API 文档（TypeDoc）

从源码 JSDoc 自动生成的交互式 API 文档：

```bash
pnpm docs          # 生成到 api-docs/
pnpm docs:watch    # 监听源码变更自动重建
```

生成后打开 `api-docs/index.html` 浏览，包含类、方法、类型、枚举的完整签名与中文注释。

## API 模块

| 模块 | Scope | 方法数 |
|------|-------|--------|
| `client.envs` | `envs` | 14 |
| `client.crons` | `crons` | 27 |
| `client.subscriptions` | `subscriptions` | 12 |
| `client.configs` | `configs` | 5 |
| `client.scripts` | `scripts` | 10 |
| `client.logs` | `logs` | 5 |
| `client.dependencies` | `dependencies` | 8 |
| `client.system` | `system` | 22 |

## 错误处理

```typescript
import { QinglongApiError } from 'qinglong-client';

try {
  await client.envs.create([{ name: 'INVALID', value: '1' }]);
} catch (e) {
  if (e instanceof QinglongApiError) {
    console.error(e.code, e.message);
  }
}
```

## 类型导出

```typescript
import type {
  Env,
  Crontab,
  Subscription,
  Dependence,
  SystemConfig,
  CreateEnvItem,
  CronMutationRequest,
  NotifyRequest,
} from 'qinglong-client';
```

## 开发

```bash
pnpm install
pnpm build      # 构建 ESM + CJS + .d.ts
pnpm typecheck  # 类型检查
pnpm docs       # 生成 TypeDoc API 文档
```

## License

Apache-2.0
